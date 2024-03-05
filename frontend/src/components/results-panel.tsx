import { DirectoryContent } from "#/lib/types";
import { Loader2 } from "lucide-react";
import FileFolderComponent from "./file-folder-component";
import { ScrollArea } from "./ui/scroll-area";

export default function ResultsPanel({
  isLoading,
  results,
}: {
  isLoading: boolean;
  results: DirectoryContent | undefined;
}) {
  if (isLoading) {
    return (
      <div className="flex w-full h-[30vh] lg:h-[50vh] items-center justify-center border rounded-sm mt-2">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  if (!results) {
    return <div></div>;
  }
  if (results.files_directories.length === 0) {
    return (
      <div className="flex h-[30vh] lg:h-[50vh] items-center justify-center border rounded-sm mt-2">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Oops.. No results found!
        </h4>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center w-full lg:mt-4 border rounded-sm px-2 mt-2 pb-2">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Search Results
      </h3>
      <div className="flex w-full justify-end">
        <p className="leading-7 mr-4 mb-2">
          No of Results: <b>{results.files_directories.length}</b>
        </p>
        <p className="leading-7 r-4 mb-2">
          Search Time: <b>{results.search_time}</b>ms
        </p>
      </div>
      <ScrollArea className="h-[25vh] lg:h-[44vh] w-full">
        <div className="grid grid-cols-3 lg:grid-cols-8 gap-2 items-center">
          {results.files_directories.map((fd, idx) => (
            <FileFolderComponent key={idx} data={fd} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
