import { FolderSync, RotateCwIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import IndexesPanel from "./indexes-panel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { openDirectory } from "#/functions/tauriFunctions";
import { toast } from "sonner";
import { indexDirectory } from "#/functions/apiFunctions";

export default function IndexManagementSheet() {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["openDirectory"],
    queryFn: openDirectory,
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const { mutateAsync: indexDirectoryAsync } = useMutation({
    mutationKey: ["indexDirectory"],
    mutationFn: indexDirectory,
    onSuccess: () => {
      toast.success("Indexing started");
      queryClient.invalidateQueries({ queryKey: ["getAllIndexes"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onOpenDirectoryClick = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: ["openDirectory"],
      queryFn: openDirectory,
    });
    if (!data) {
      return;
    }
  };

  const onIndexingStartClick = async () => {
    if (!data) {
      toast.error("Please select a directory first");
      return;
    }
    indexDirectoryAsync(data.escapedDirectoryPath);
    queryClient.removeQueries({ queryKey: ["openDirectory"] });
  };

  return (
    <Sheet>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <FolderSync className="hover:animate-pulse h-5 w-5" />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">Indexing Management</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Indexing Management</SheetTitle>
          <SheetDescription>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque
            accusantium minima voluptas consectetur unde reiciendis tempore
            dolore reprehenderit, ipsum in praesentium quaerat quidem. Sint,
            placeat ducimus recusandae rem impedit enim!
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col w-[100%] my-4 justify-between">
          <div className="flex flex-row gap-2">
            <Button
              onClick={onOpenDirectoryClick}
              variant="secondary"
              className="flex flex-row items-center"
            >
              Select a Folder for Indexing&nbsp;
              {isFetching && !data && (
                <RotateCwIcon className="h-4 w-4 animate-spin" />
              )}
            </Button>
            <Button onClick={onIndexingStartClick} variant="default">
              Start Indexing
            </Button>
          </div>
          {data && (
            <Label className="mt-2">
              Index Target:&nbsp;{data.directoryDisplayString}
            </Label>
          )}
        </div>
        <div className="flex w-full ">
          <IndexesPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
}
