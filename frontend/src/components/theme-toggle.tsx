"use client";
import { useTransition, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();
  const [, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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
