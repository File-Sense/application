import {
  isDirectoryEntry,
  pathToDisplayPath,
} from "#/functions/commonFunctions";
import { SearchEntry } from "#/lib/types";
import { invoke } from "@tauri-apps/api/tauri";
import { Folder, File } from "lucide-react";
import { Button } from "./ui/button";
import CopyAction from "./copy-action";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "#/components/ui/hover-card";

export default function FileFolderComponent({ data }: { data: SearchEntry }) {
  const openFileInFilemanager = async (path: string) => {
    await invoke<string>("show_in_folder", {
      path,
    });
  };

  if (isDirectoryEntry(data)) {
    return (
      <div className="flex flex-col w-30 h-30 items-center justify-center border rounded-md p-2">
        <Folder size={40} />
        <HoverCard>
          <HoverCardTrigger>
            <div className="flex items-center justify-center w-20">
              <p className="text-sm italic truncate">{data.Directory[0]}</p>
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex w-full items-center justify-center p-1">
              <p className="text-sm italic truncate">
                {pathToDisplayPath(data.Directory[1])}
              </p>
              <CopyAction text={data.Directory[1]} />
            </div>
            <div className="flex justify-center">
              <Button
                variant={"ghost"}
                onClick={async () => openFileInFilemanager(data.Directory[1])}
              >
                OPEN
              </Button>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col w-30 h-30 items-center justify-center border rounded-md p-2">
        <File size={40} />
        <HoverCard>
          <HoverCardTrigger>
            <div className="flex items-center justify-center w-20">
              <p className="text-sm italic truncate">{data.File[0]}</p>
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex w-full items-center justify-center p-1">
              <p className="text-sm italic truncate">
                {pathToDisplayPath(data.File[1])}
              </p>
              <CopyAction text={data.File[1]} />
            </div>
            <div className="flex justify-center">
              <Button
                variant={"ghost"}
                onClick={async () => openFileInFilemanager(data.File[1])}
              >
                OPEN
              </Button>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    );
  }
}
