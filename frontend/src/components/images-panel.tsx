import { useAtom } from "jotai";
import ImageComponent from "./image-component";
import { ScrollArea } from "./ui/scroll-area";
import { fetchedPathsAtom } from "#/lib/atoms";

export default function ImagesPanel() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fetchedPaths, _] = useAtom(fetchedPathsAtom);
  if (fetchedPaths.length === 0) {
    return <></>;
  }
  return (
    <ScrollArea className="max-h-64 lg:max-h-[500px] rounded-md border">
      <div className="flex flex-col w-full items-center p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">
          Search Results
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          {fetchedPaths.map((path, idx) => (
            <ImageComponent key={idx} imagePath={path} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
