"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClientAtom } from "jotai-tanstack-query";
import { useAtomValue } from "jotai";

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useAtomValue(queryClientAtom);

  return (
    <QueryClientProvider client={queryClient!}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
