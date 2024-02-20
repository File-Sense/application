import { ping } from "#/functions/apiFunctions";
import { getVolumeData } from "#/functions/tauriFunctions";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";

export const pingAtom = atomWithQuery(() => ({
  queryKey: ["ping"],
  queryFn: ping,
  retry: true,
  retryDelay: 2000,
  refetchOnMount: true,
}));

export const volumeDataAtom = atomWithQuery(() => ({
  queryKey: ["getVolumeData"],
  queryFn: getVolumeData,
  staleTime: Infinity,
}));

export const globalIndexingStateAtom = atom(false);

export const refImageAtom = atom<string | null>(null);

export const fetchedPathsAtom = atom<string[]>([]);

export const aboutFileSenseDialogStateAtom = atom(false);
