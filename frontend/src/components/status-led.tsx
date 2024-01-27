import { cn } from "#/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { getIndexes } from "#/functions/apiFunctions";
import { useAtom } from "jotai";
import { pingAtom } from "#/lib/atoms";
export default function StatusLed() {
  const [{ data, isSuccess }] = useAtom(pingAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useQuery({
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
