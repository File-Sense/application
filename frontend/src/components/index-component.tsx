"use client";

import { ReactNode, useState } from "react";
import { Badge } from "./ui/badge";
import { IndexData } from "#/lib/types";
import { pathToDisplayPath } from "#/functions/commonFunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { deleteIndex } from "#/functions/apiFunctions";

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
  const queryClient = useQueryClient();
  const { mutateAsync: deleteIndexAsync } = useMutation({
    mutationKey: ["deleteIndex"],
    mutationFn: deleteIndex,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllIndexes"] });
    },
  });
  const [open, setOpen] = useState(false);
  const path = pathToDisplayPath(data.index_path);

  const onDeleteClick = async () => {
    await deleteIndexAsync(data.index_id);
    setOpen(false);
  };

  return (
    <div className="flex flex-col w-[100%] h-auto p-2 border  rounded-lg mb-2">
      <h5 className="ml-2 mb-5">{path}</h5>
      <div className="flex flex-row justify-around mt-1 items-center mb-2">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <button
              disabled={data.index_status === 1}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors  focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/8"
            >
              Delete
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                indexed data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={onDeleteClick} variant="destructive">
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <BadgeSelector status={data.index_status} />
      </div>
    </div>
  );
}
