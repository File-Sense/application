import { ping } from "#/functions/apiFunctions";
import { atomWithQuery } from "jotai-tanstack-query";

export const pingAtom = atomWithQuery(() => ({
  queryKey: ["ping"],
  queryFn: ping,
  retry: true,
  retryDelay: 2000,
  refetchOnMount: true,
}));
