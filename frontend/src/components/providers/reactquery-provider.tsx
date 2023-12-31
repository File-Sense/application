"use client";

import { Provider } from "jotai/react";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHydrateAtoms } from "jotai/react/utils";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClientAtom } from "jotai-tanstack-query";

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  const HydrateAtoms = ({ children }: { children: ReactNode }) => {
    useHydrateAtoms([[queryClientAtom, queryClient]]);
    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrateAtoms>{children}</HydrateAtoms>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
