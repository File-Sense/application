import Loading from "#/components/loading";
import ResultsPanel from "#/components/results-panel";
import SearchControlMenuMetadataSearch from "#/components/search-control-menu-metadata-search";
import TreeControl from "#/components/tree-control";
import { isDirectoryEntry } from "#/functions/commonFunctions";
import { searchFilesAndDirectories } from "#/functions/tauriFunctions";
import { volumeDataAtom } from "#/lib/atoms";
import {
  DirectoryContent,
  MetadataSearchSchema,
  SearchEntry,
  TreeData,
} from "#/lib/types";
import { useAtom } from "jotai";
import { useState } from "react";

export default function SearchByMetadata() {
  const [{ data, isLoading }] = useAtom(volumeDataAtom);
  const [selectedTreePath, setSelectedTreePath] = useState<string | null>(null);
  const [directoryContent, setDirectoryContent] = useState<
    SearchEntry[] | undefined
  >(undefined);
  const [searchContent, setSearchContent] = useState<
    DirectoryContent | undefined
  >(undefined);
  const [resultLoading, setResultLoading] = useState<boolean>(false);

  const getFormatedTreedata = (data: SearchEntry[]): TreeData[] => {
    const directories = data.filter(isDirectoryEntry);
    const treeData: TreeData[] = directories.map((directory) => {
      return {
        id: directory.Directory[1],
        name: directory.Directory[0],
      };
    });
    return treeData;
  };

  if (isLoading) {
    return <Loading />;
  }

  const onSubmit = async ({
    extension,
    keyword,
    mountPoint,
    searchType,
  }: MetadataSearchSchema) => {
    setResultLoading(true);
    const acceptFiles = searchType.includes("SearchFiles");
    const acceptDirs = searchType.includes("SearchFolders");
    const searchResults = await searchFilesAndDirectories({
      acceptFiles,
      acceptDirs,
      extension,
      keyword,
      mountPoint,
      searchDirectory: selectedTreePath || mountPoint,
    });
    setSearchContent(searchResults);
    setResultLoading(false);
  };

  return (
    <div className="flex gap-5 ">
      {directoryContent !== undefined && directoryContent.length !== 0 && (
        <TreeControl
          initTreeData={getFormatedTreedata(directoryContent)}
          setSelectedDirectory={setSelectedTreePath}
        />
      )}
      <div className="flex flex-col w-full">
        {data && (
          <SearchControlMenuMetadataSearch
            drives={data}
            onSubmit={onSubmit}
            setDirectoryContent={setDirectoryContent}
          />
        )}
        <ResultsPanel isLoading={resultLoading} results={searchContent} />
      </div>
    </div>
  );
}
