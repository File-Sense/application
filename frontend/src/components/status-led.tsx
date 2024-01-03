"use client";

import { cn } from "#/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { getIndexes, ping } from "#/functions/apiFunctions";
export default function StatusLed() {
  const { data, isSuccess } = useQuery({
    queryKey: ["ping"],
    queryFn: ping,
    retry: true,
    retryDelay: 2000,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 2,
  });
  const _ = useQuery({
    queryKey: ["getAllIndexes"],
    queryFn: getIndexes,
    enabled: isSuccess,
    placeholderData: { data: [] },
  });

  return (
    <div className="flex items-center gap-1">
      <div className="text-xl font-medium">AI STATUS:</div>
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
