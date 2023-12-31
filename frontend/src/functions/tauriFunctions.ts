"use client";

import { open as dialogOpen } from "@tauri-apps/api/dialog";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { uint8arrayToBlob } from "./commonFunctions";
import { useAtom } from "jotai";
import { imageObjUrlAtom } from "#/lib/atoms";

function extractFileNameAndExtension(path: string): {
  fileName: string;
  extension: string;
} {
  const match = path.match(/\\([^\\]+(\.[^\\]+)?)$/);

  if (match) {
    const fileNameWithExtension = match[1];
    const lastDotIndex = fileNameWithExtension.lastIndexOf(".");

    if (lastDotIndex !== -1) {
      const fileName = fileNameWithExtension.substring(0, lastDotIndex);
      const extension = fileNameWithExtension.substring(lastDotIndex + 1);
      return { fileName, extension };
    }
  }

  return { fileName: "", extension: "" };
}

export const openImageFile = async (): Promise<string | undefined> => {
  const selectedFile = await dialogOpen({
    title: "Select Reference Image",
    filters: [
      {
        name: "Images",
        extensions: ["jpg", "png", "gif"],
      },
    ],
  });
  if (!selectedFile) {
    return;
  }
  const { fileName, extension } = extractFileNameAndExtension(
    selectedFile as string
  );
  console.log(
    "🤬 ~ file: tauriFunctions.ts:40 ~ openImageFile ~ fileName:",
    fileName
  );
  console.log(
    "🤬 ~ file: tauriFunctions.ts:40 ~ openImageFile ~ extension:",
    extension
  );
  const binaryContent = await readBinaryFile(selectedFile as string);
  console.log(
    "🤬 ~ file: tauriFunctions.ts:51 ~ openImageFile ~ binaryContent:",
    binaryContent
  );
  const imageBlob = uint8arrayToBlob(binaryContent, extension);
  return URL.createObjectURL(imageBlob);
};
