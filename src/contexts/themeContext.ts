import { createContext } from "react";
import type { Theme } from "../themeStorage";

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
