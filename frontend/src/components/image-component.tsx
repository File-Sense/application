import {
  extractFileNameAndExtension,
  getImageObjectUrl,
  pathToDisplayPath,
} from "#/functions/commonFunctions";
import { useQuery } from "@tanstack/react-query";
import { FolderTreeIcon, Loader2 } from "lucide-react";
import CopyAction from "./copy-action";
import { invoke } from "@tauri-apps/api/tauri";
export default function ImageComponent({ imagePath }: { imagePath: string }) {
  const { isLoading, data: imageURL } = useQuery({
    queryKey: ["read_image", { imagePath }],
    queryFn: () => getImageObjectUrl(imagePath),
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  const { fileName, extension } = extractFileNameAndExtension(imagePath);
  const displayPath = pathToDisplayPath(imagePath);

  const openImageInFilemanager = async () => {
    await invoke<string>("show_in_folder", {
      path: imagePath.replace(/\\+/g, "\\"),
    });
  };

  return (
    <div className="group relative cursor-pointer items-center justify-center overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/30">
      <div className="h-96 w-72">
        {isLoading ? (
          <div className="h-full w-full flex justify-center items-center">
            <Loader2 className="animate-spin" size={50} />
          </div>
        ) : imageURL ? (
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125"
            src={imageURL}
            alt={fileName}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-2xl text-white">Ooops!</div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 flex translate-y-[100%] flex-col items-center justify-end text-center transition-all duration-500 group-hover:translate-y-0">
        <div className="flex flex-col bg-black p-3 items-center">
          <div className="flex items-center justify-start group w-full">
            <p className="w-56 text-sm italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 truncate">
              {fileName}
            </p>
            <CopyAction text={`${fileName}.${extension}`} />
          </div>
          <div className="flex items-center justify-start group">
            <p className="w-56 text-sm italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 truncate">
              {displayPath}
            </p>
            <CopyAction text={imagePath} />
          </div>
          <button
            onClick={openImageInFilemanager}
            className="mt-4 flex flex-row items-center justify-center rounded-full bg-neutral-900 py-2 font-com text-sm capitalize text-white shadow shadow-black/60 transition hover:bg-neutral-300 hover:text-black md:w-9/12 lg:w-11/12"
          >
            Open In File Explorer
            <FolderTreeIcon className="ml-2" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
