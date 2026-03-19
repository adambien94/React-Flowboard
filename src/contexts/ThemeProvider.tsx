import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../useLocalStorage";
import { THEME_STORAGE_KEY, type Theme } from "../themeStorage";
import { ThemeContext } from "./themeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
