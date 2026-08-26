import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider locked to the unified, ultra-premium Dark Divine Theme ("Royal Aura").
 * Eliminates all light/dark mode color mismatches across pages and components.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useState<Theme>("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }, []);

  const toggleTheme = () => {
    // Single theme architecture — unified Royal Dark Aura
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
