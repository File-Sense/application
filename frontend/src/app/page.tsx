"use client";
import { Button } from "#/components/ui/button";
import { imageObjUrlAtom, pingAtom } from "#/lib/atoms";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { homeDir } from "@tauri-apps/api/path";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import { openImageFile } from "#/functions/tauriFunctions";
import ImageComponent from "#/components/image-component";

export default function Home() {
  const [text, setText] = useState<string | undefined>();
  const [imageObjUrl, setImageObjUrl] = useAtom(imageObjUrlAtom);
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(
    null
  );
  const [{ data, isSuccess }] = useAtom(pingAtom);
  function functionx(inputPath: string): string {
    // Use the replace method to replace single backslashes with double backslashes
    const escapedPath = inputPath.replace(/\\/g, "\\\\");
    return escapedPath;
  }
  // const {} = useQuery({
  //   queryKey: ["PING"],
  //   queryFn: ping,
  //   refetchInterval: 2000,
  //   retry: true,
  // });

  const handleClick = async () => {
    console.log("🤬 ~ file: page.tsx:11 ~ Home ~ data:", data?.ping);
    setText(data?.ping);
    // const response = await invoke<string>("greet", { name: "Pasindu" });
    // setText(response);
  };

  const dirSelectorClick = async () => {
    const selectedDir = await open({
      title: "Select a Directory for Indexing",
      directory: true,
      defaultPath: await homeDir(),
    });
    if (!selectedDir) {
      return;
    }
    const t = functionx(selectedDir as string);
    setSelectedDirectory(t);
  };

  const openImageInFilemanager = async () => {
    const filePath =
      "D:\\sample directory\\sub dir\\merve-kalafat-yilmaz-VjReb_MXHdk-unsplash.jpg";
    const response = await invoke<string>("show_in_folder", { path: filePath });
    if (response === "ERROR") {
      toast.error("This Feature is not supported on your OS");
    }
  };

  // const openImageFile = async () => {
  //   const selectedFile = await open({
  //     title: "Select Reference Image",
  //     filters: [
  //       {
  //         name: "Images",
  //         extensions: ["jpg", "png", "gif"],
  //       },
  //     ],
  //   });
  //   console.log(
  //     "🤬 ~ file: page.tsx:69 ~ openImageFile ~ selectedFile:",
  //     selectedFile
  //   );
  //   if (!selectedFile) {
  //     return;
  //   }
  //   const contents = await readBinaryFile(selectedFile as string);
  //   console.log("🤬 ~ file: page.tsx:73 ~ openImageFile ~ contents:", contents);
  // };

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
      {text && <div>{text}</div>}
      <Button onClick={handleClick}>Click Me</Button>
      <Button onClick={dirSelectorClick}>Open Directory</Button>
      <div>Selected Dir: {selectedDirectory ? selectedDirectory : ""}</div>
      <Button onClick={openImageInFilemanager}>Open Image in Explorer</Button>
      <Button disabled={!isSuccess} onClick={openImageTest}>
        Open Image File
      </Button>
      {imageObjUrl && <ImageComponent imageObjUrl={imageObjUrl} />}
      <Button
        onClick={async () => {
          await invoke("set_index_state", { iState: true });
        }}
      >
        Set Indexing State
      </Button>
    </div>
  );
}
