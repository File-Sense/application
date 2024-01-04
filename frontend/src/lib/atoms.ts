import { ping } from "#/functions/apiFunctions";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { string } from "zod";

export const pingAtom = atomWithQuery(() => ({
  queryKey: ["ping"],
  queryFn: ping,
  retry: true,
  retryDelay: 2000,
  refetchOnMount: true,
}));

export const globalIndexingStateAtom = atom(false);

export const refImageAtom = atom<string | null>(null);

export const fetchedPathsAtom = atom<string[]>([]);
