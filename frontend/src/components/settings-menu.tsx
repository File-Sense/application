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
import { useAtom } from "jotai";
import { useTheme } from "./providers/theme-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Settings,
  Moon,
  Sun,
  HelpCircle,
  TestTube2,
  BugIcon,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { aboutFileSenseDialogStateAtom } from "#/lib/atoms";
import { open as tauriOpen } from "@tauri-apps/api/shell";
import { toast } from "sonner";

export default function SettingsMenu() {
  const [mounted, setMounted] = useState(false);
  const [, setOpen] = useAtom(aboutFileSenseDialogStateAtom);
  const { setTheme, theme } = useTheme();
  const [, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="transition hover:rotate-90 h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">Settings</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
        <DropdownMenuItem
          onClick={() => {
            toast.info(
              "This feature is still in development. Please check back later!"
            );
          }}
        >
          <TestTube2 className="mr-2 h-4 w-4" />
          <span>Experimental Model</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            toast.promise(
              tauriOpen("https://research.typeform.com/to/hYkNSTB6"),
              {
                loading: "Opening...",
                success: "Please fill out the form to report an issue!",
              }
            );
          }}
        >
          <BugIcon className="mr-2 h-4 w-4" />
          <span>Report an issue...</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpen(true)} className="w-full">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>About File Sense</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
