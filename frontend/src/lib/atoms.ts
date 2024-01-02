import { ping } from "#/functions/apiFunctions";
import { atomWithMutation, atomWithQuery } from "jotai-tanstack-query";

export const pingAtom = atomWithQuery(() => ({
  queryKey: ["ping"],
  queryFn: ping,
  retry: true,
  retryDelay: 2000,
  refetchOnMount: true,
}));

export const indexDirectoryAtom = atomWithMutation(() => ({
  mutationKey: ["indexDirectory"],
}));
