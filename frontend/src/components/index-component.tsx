"use client";

import { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { useQuery } from "@tanstack/react-query";
import { IndexData } from "#/lib/types";
import { pathToDisplayPath } from "#/functions/commonFunctions";

const BadgeSelector = ({
  status,
}: {
  status: "INDEXING" | "INDEXED" | "FAILED";
}): ReactNode => {
  let badge = <></>;
  switch (status) {
    case "FAILED":
      badge = (
        <Badge
          variant="secondary"
          className="bg-red-600 text-white cursor-default"
        >
          Failed
        </Badge>
      );
      break;
    case "INDEXED":
      badge = (
        <Badge
          variant="secondary"
          className="bg-green-600 text-white cursor-default"
        >
          Indexed
        </Badge>
      );
      break;
    case "INDEXING":
      badge = (
        <Badge
          variant="secondary"
          className="bg-yellow-600 text-white cursor-default"
        >
          Indexing
        </Badge>
      );
      break;
    default:
      break;
  }
  return badge;
};

export interface IndexComponentProps {
  data: IndexData;
}

export default function IndexComponent({ data }: IndexComponentProps) {
  const path = pathToDisplayPath(data.index_path);
  return (
    <div className="flex flex-col w-[100%] h-auto p-2 border  rounded-lg mb-2">
      <h5 className="ml-2 mb-5">{path}</h5>
      <div className="flex flex-row justify-around mt-1 items-center mb-2">
        <Badge className="cursor-pointer" variant="destructive">
          Delete
        </Badge>
        <BadgeSelector status="INDEXING" />
      </div>
    </div>
  );
}
