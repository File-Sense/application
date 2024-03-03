import Loading from "#/components/loading";
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

  const onSubmit = async (data: MetadataSearchSchema) => {
    const sc = await searchFilesAndDirectories({
      searchDirectory: selectedTreePath ?? data.mountPoint,
      ...data,
    });
    setSearchContent(sc);
  };

  return (
    <div>
      {directoryContent !== undefined && directoryContent.length !== 0 && (
        <TreeControl
          initTreeData={getFormatedTreedata(directoryContent)}
          setSelectedDirectory={setSelectedTreePath}
        />
      )}
      {data && (
        <SearchControlMenuMetadataSearch
          drives={data}
          onSubmit={onSubmit}
          setDirectoryContent={setDirectoryContent}
        />
      )}
    </div>
  );
}
