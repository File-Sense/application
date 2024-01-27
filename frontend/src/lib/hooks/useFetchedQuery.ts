import { QueryKey, useQueryClient } from "@tanstack/react-query";

export const useFetchedQuery = (key: QueryKey) => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(key);
};
