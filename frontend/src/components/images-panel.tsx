import { useAtom } from "jotai";
import ImageComponent from "./image-component";
import { ScrollArea } from "./ui/scroll-area";
import { fetchedPathsAtom } from "#/lib/atoms";

export default function ImagesPanel() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fetchedData, _] = useAtom(fetchedPathsAtom);
  if (fetchedData === null) {
    return <></>;
  }
  return (
    <ScrollArea className="max-h-64 lg:max-h-[500px] rounded-md border">
      <div className="flex flex-col w-full items-center p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Search Results
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          {fetchedData.img_paths.map((path, idx) => (
            <ImageComponent
              key={idx}
              imagePath={path}
              imageDistance={fetchedData.img_distances[idx]}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
