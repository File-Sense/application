"use client";
import { useTransition } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [_, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        startTransition(() => {
          setTheme(theme === "light" ? "dark" : "light");
        });
      }}
    >
      {theme === "dark" ? (
        <MoonIcon className="transition-all" />
      ) : (
        <SunIcon className="transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
