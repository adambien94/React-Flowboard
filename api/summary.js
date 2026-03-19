export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { title, description } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You generate short summaries of tasks.",
          },
          {
            role: "user",
            content: `Summarize the task based on:
  Title: ${title}
  Description: ${description}`,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("summary", data);

    return res.status(200).json({
      summary: data.choices?.[0]?.message?.content ?? "No summary available",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "AI error" });
  }
}
