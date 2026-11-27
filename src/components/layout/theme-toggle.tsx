"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  useEffect(() => {
    const preference = localStorage.getItem("taskvidia-theme");
    const dark = preference
      ? preference === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", preference === "light");
  }, []);

  function toggleTheme() {
    const html = document.documentElement;
    const nextDark =
      html.classList.contains("light") || !html.classList.contains("dark");
    html.classList.toggle("dark", nextDark);
    html.classList.toggle("light", !nextDark);
    localStorage.setItem("taskvidia-theme", nextDark ? "dark" : "light");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}
