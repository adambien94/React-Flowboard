// @ts-expect-error - Edge Functions runtime uses Deno modules/typings.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

function getCorsHeaders(
  origin: string | null,
  requestHeaders: string | null
) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Headers":
      // Echo preflight requested headers if present; otherwise allow the known ones.
      // This avoids CORS failing when the client sends extra headers.
      requestHeaders ?? "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    // Avoid caching a failed preflight response in the browser.
    "Access-Control-Max-Age": "0",
  };
}

function jsonResponse(
  data: unknown,
  status = 200,
  origin: string | null = null,
  requestHeaders: string | null = null
): Response {
  const headers = getCorsHeaders(origin, requestHeaders);
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function extractJson(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    // Gemini sometimes wraps JSON in markdown/code blocks; try to extract the first {...}
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

serve(async (req) => {
  const origin = req.headers.get("Origin");
  const requestHeaders = req.headers.get("Access-Control-Request-Headers");

  if (req.method === "OPTIONS") {
    // Some gateways/browsers treat non-200 responses on preflight as failure.
    // Return 200 with JSON to maximize compatibility.
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        ...getCorsHeaders(origin, requestHeaders),
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { error: "Only POST allowed" },
      405,
      origin,
      requestHeaders
    );
  }

  try {
    const { title, description } = await req.json().catch(() => ({}));

    if (typeof title !== "string" || !title.trim()) {
      return jsonResponse(
        { error: "Missing `title`" },
        400,
        origin,
        requestHeaders
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return jsonResponse(
        { error: "Missing `GEMINI_API_KEY` secret" },
        500,
        origin,
        requestHeaders
      );
    }

    const safeTitle = title.trim();
    const safeDescription =
      typeof description === "string" ? description.trim() : "";

    const prompt = `Wygeneruj maksymalnie 5 kroków działania na podstawie tytułu i opisu zadania.

Zasady:
- Odpowiedź ma być w formie JSON.
- Zwróć wyłącznie obiekt w formacie: { "steps": ["...", "..."] }.
- Każdy krok ma być krótkim poleceniem (czasownik w trybie rozkazującym) po polsku.
- Liczba kroków: 1 do 5.
- Nie dodawaj żadnego dodatkowego tekstu.

Tytuł: ${safeTitle}
Opis: ${safeDescription}
`;

    // `gemini-1.5-flash` can be removed/changed over time; use an alias that stays valid.
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600,
          responseMimeType: "application/json",
        },
      }),
    });

    type GeminiPart = { text?: string };
    type GeminiCandidate = { content?: { parts?: GeminiPart[] } };
    type GeminiResponse = { candidates?: GeminiCandidate[] };

    let data: GeminiResponse = {};
    let rawBody = "";
    try {
      data = (await response.json()) as GeminiResponse;
    } catch {
      rawBody = await response.text().catch(() => "");
    }

    if (!response.ok) {
      console.error("Gemini request failed", {
        status: response.status,
        details: data,
        rawBody,
      });
      return jsonResponse(
        { error: "Gemini request failed", details: data || {}, rawBody },
        502,
        origin,
        requestHeaders
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => (typeof p?.text === "string" ? p.text : ""))
        .join("") ?? "";

    const parsed = extractJson(text) as { steps?: unknown } | null;
    const rawSteps = parsed?.steps;

    const steps = Array.isArray(rawSteps)
      ? rawSteps
        .filter((s) => typeof s === "string")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5)
      : [];

    return jsonResponse({ steps }, 200, origin, requestHeaders);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "AI error" }, 500, origin, requestHeaders);
  }
});

