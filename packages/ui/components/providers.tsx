"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  PersistQueryClientProvider,
  persistQueryClient,
} from "@tanstack/react-query-persist-client";
// import { WorkspaceProvider } from "./workspace/workspace-context";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

// const persister = cre
const localStoragePersister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

// persistQueryClient({
//   persister: localStoragePersister,
//   maxAge: Infinity,
// });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        maxAge: Infinity,
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
