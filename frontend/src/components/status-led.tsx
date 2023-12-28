"use client";
import { cn } from "#/lib/utils";
import { useAtom } from "jotai";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import { pingAtom } from "#/lib/atoms";
export function StatusLed() {
  const [{ data }] = useAtom(pingAtom);

  return (
    <div className="flex items-center gap-1">
      <div className="text-sm font-semibold">AI STATUS:</div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={data?.ping === "pong" ? "led-green" : "led-red"} />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              AI is currently{" "}
              <span
                className={cn(
                  data?.ping === "pong" ? "text-green-500" : "text-red-500"
                )}
              >
                {data?.ping === "pong" ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
