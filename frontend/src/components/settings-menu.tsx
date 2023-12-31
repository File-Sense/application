"use client";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Settings, Moon, Sun, HelpCircle, TestTube2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useTransition } from "react";

export default function SettingsMenu() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();
  const [_, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="transition hover:rotate-90 h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              startTransition(() => {
                setTheme(theme === "light" ? "dark" : "light");
              });
            }}
          >
            {theme === "dark" ? (
              <Moon className="mr-2 transition-all h-4 w-4" />
            ) : (
              <Sun className="mr-2 transition-all h-4 w-4" />
            )}
            <span>Toggle theme</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <TestTube2 className="mr-2 h-4 w-4" />
          <span>Experimental Model</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>About Developer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
