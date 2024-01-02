"use client";

import { open as dialogOpen } from "@tauri-apps/api/dialog";
import { readBinaryFile } from "@tauri-apps/api/fs";
import {
  extractFileNameAndExtension,
  pathReplace,
  pathToDisplayPath,
  uint8arrayToBlob,
} from "./commonFunctions";
import { OpenDirectoryReturnObject, OpenImageReturnObject } from "#/lib/types";
import { homeDir } from "@tauri-apps/api/path";

export const openImageFile = async (): Promise<
  OpenImageReturnObject | false
> => {
  const selectedFile = await dialogOpen({
    title: "Select Reference Image",
    filters: [
      {
        name: "Images",
        extensions: ["jpg", "png", "jpeg"],
      },
    ],
  });
  if (!selectedFile) {
    return false;
  }
  const { fileName, extension } = extractFileNameAndExtension(
    selectedFile as string
  );
  const binaryContent = await readBinaryFile(selectedFile as string);
  const imageBlob = uint8arrayToBlob(binaryContent, extension);

  return {
    imageName: fileName,
    imageExtension: extension,
    imageObjectUrl: URL.createObjectURL(imageBlob),
  };
};

export const openDirectory = async (): Promise<
  OpenDirectoryReturnObject | false
> => {
  const selectedDirectory = await dialogOpen({
    title: "Select a Directory for Indexing",
    directory: true,
    defaultPath: await homeDir(),
  });
  if (!selectedDirectory) {
    return false;
  }
  console.log(
    "🤬 ~ file: tauriFunctions.ts:71 ~ selectedDirectory:",
    selectedDirectory
  );
  const escapedPath = pathReplace(selectedDirectory as string);
  const displayPath = pathToDisplayPath(selectedDirectory as string);
  return {
    directoryPath: selectedDirectory as string,
    escapedDirectoryPath: escapedPath,
    directoryDisplayString: displayPath,
  } as OpenDirectoryReturnObject;
};
