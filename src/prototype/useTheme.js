import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("kovan-theme", theme);
    } catch {
      // The switch still works when browser storage is unavailable.
    }
  }, [theme]);

  return [
    theme,
    () => setTheme((current) => (current === "dark" ? "light" : "dark")),
  ];
}
