"use client";

import { Button } from "#/components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { toast } from "sonner";
import { openDirectory, openImageFile } from "#/functions/tauriFunctions";
import ImageComponent from "#/components/image-component";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ping } from "#/functions/apiFunctions";

export default function Home() {
  const queryClient = useQueryClient();
  const [text, setText] = useState<string | undefined>();
  const [imageObjUrl, setImageObjUrl] = useState<string | undefined>();
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(
    null
  );
  const { data, isSuccess } = useQuery({
    queryKey: ["ping"],
    queryFn: ping,
  });

  const handleClick = async () => {
    console.log("🤬 ~ file: page.tsx:11 ~ Home ~ data:", data?.ping);
    setText(data?.ping);
    // const response = await invoke<string>("greet", { name: "Pasindu" });
    // setText(response);
  };

  const dirSelectorClick = async () => {
    const data = await openDirectory();
    if (!data) {
      return;
    }
    setSelectedDirectory(data.escapedDirectoryPath);
  };

  const openImageInFilemanager = async () => {
    const filePath =
      "D:\\sample directory\\sub dir\\merve-kalafat-yilmaz-VjReb_MXHdk-unsplash.jpg";
    const response = await invoke<string>("show_in_folder", { path: filePath });
    if (response === "ERROR") {
      toast.error("This Feature is not supported on your OS");
    }
  };

  const openImageTest = async () => {
    const imageObj = await openImageFile();
    if (!imageObj) {
      return;
    }
    setImageObjUrl((prevUrl) => {
      URL.revokeObjectURL((prevUrl ??= ""));
      return imageObj.imageObjectUrl;
    });
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex flex-col items-center justify-between pt-5"
    >
      <div>Test Page</div>
      {/* {text && <div>{text}</div>}
      <Button onClick={handleClick}>Click Me</Button>
      <Button onClick={dirSelectorClick}>Open Directory</Button>
      <div>Selected Dir: {selectedDirectory ? selectedDirectory : ""}</div>
      <Button onClick={openImageInFilemanager}>Open Image in Explorer</Button>
      <Button disabled={!isSuccess} onClick={openImageTest}>
        Open Image File
      </Button>
      <Button
        onClick={async () => {
          await invoke("set_index_state", { iState: true });
        }}
      >
        Set Indexing State
      </Button> */}
    </div>
  );
}
