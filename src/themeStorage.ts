export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "flowboard-theme";

export function readStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw == null) return "dark";
    const v = JSON.parse(raw) as unknown;
    return v === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}
