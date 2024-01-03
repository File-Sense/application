"use client";

import { ReactNode, useEffect } from "react";
import { Badge } from "./ui/badge";
import { IndexData } from "#/lib/types";
import { pathToDisplayPath } from "#/functions/commonFunctions";
import { useQuery } from "@tanstack/react-query";
import { getIndexStatus } from "#/functions/apiFunctions";
import { toast } from "sonner";

const BadgeSelector = ({ status }: { status: number }): ReactNode => {
  let badge = <></>;
  switch (status) {
    case -1:
      badge = (
        <Badge
          variant="secondary"
          className="bg-red-600 text-white cursor-default"
        >
          Failed
        </Badge>
      );
      break;
    case 0:
      badge = (
        <Badge
          variant="secondary"
          className="bg-green-600 text-white cursor-default"
        >
          Indexed
        </Badge>
      );
      break;
    case 1:
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
  // const { data: indexData } = useQuery({
  //   queryKey: ["indexStatus", data.index_id],
  //   queryFn: () => getIndexStatus(data.index_id),
  //   enabled: ![0, -1].includes(data.index_status),
  //   refetchInterval: (query) => ([0, -1].includes(query.state.data?.data || 1) ? false : 2000),
  //   refetchOnMount: false,
  //   refetchOnWindowFocus: false,
  //   refetchIntervalInBackground: true,
  // });

  return (
    <div className="flex flex-col w-[100%] h-auto p-2 border  rounded-lg mb-2">
      <h5 className="ml-2 mb-5">{path}</h5>
      <div className="flex flex-row justify-around mt-1 items-center mb-2">
        <button
          onClick={() => console.log("delete")}
          disabled={data.index_status === 1}
          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors  focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/8"
        >
          Delete
        </button>
        <BadgeSelector status={data.index_status} />
      </div>
    </div>
  );
}
