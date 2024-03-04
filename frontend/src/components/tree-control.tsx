import { TreeData } from "#/lib/types";
import { Dispatch, useEffect, useState } from "react";
import { Tree } from "./ui/tree";
import { Folder } from "lucide-react";
import { openDirectoryContent } from "#/functions/tauriFunctions";
import { isDirectoryEntry } from "#/functions/commonFunctions";

export default function TreeControl({
  initTreeData,
  setSelectedDirectory,
}: {
  initTreeData: TreeData[];
  setSelectedDirectory: Dispatch<string | null>;
}) {
  const [treeData, setTreeData] = useState<TreeData[]>(initTreeData);

  useEffect(() => {
    setTreeData(initTreeData);
  }, [initTreeData]);

  const getPathDirectories = async (path: string): Promise<TreeData[]> => {
    const dc = await openDirectoryContent(path);
    const directories = dc.filter(isDirectoryEntry);
    const treeData: TreeData[] = directories.map((directory) => {
      return {
        id: directory.Directory[1],
        name: directory.Directory[0],
      };
    });

    return treeData;
  };

  function updateTreeData(
    nodes: TreeData[],
    selectedId: string,
    newData: TreeData[]
  ): TreeData[] {
    return nodes.map((node) => {
      if (node.id === selectedId) {
        const filteredNewData = newData.filter(
          (newNode) =>
            !(node.children || []).some(
              (existingChild) => existingChild.id === newNode.id
            )
        );
        return {
          ...node,
          children: [...(node.children || []), ...filteredNewData],
        };
      } else if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, selectedId, newData),
        };
      }
      return node;
    });
  }

  return (
    <Tree
      className="flex-shrink-0 h-[80vh] w-[40vh] border-[1px]"
      folderIcon={Folder}
      itemIcon={Folder}
      data={treeData}
      onSelectChange={async (selectedItem) => {
        if (selectedItem) {
          setSelectedDirectory(selectedItem.id);
          const data = await getPathDirectories(selectedItem.id);
          const updatedData = updateTreeData(treeData, selectedItem.id, data);
          setTreeData(updatedData);
        }
        return;
      }}
    />
  );
}
