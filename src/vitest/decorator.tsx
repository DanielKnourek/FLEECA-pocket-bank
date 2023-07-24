import { httpBatchLink } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { apiReact } from "@/utils/api";
import superjson from "superjson";
import { type PropsWithChildren } from "react";

const url = `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;

// https://stackoverflow.com/questions/73000884/testing-a-component-in-next-js-with-testing-library-that-relies-on-trcp
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

const trpcClient = apiReact.createClient({
  links: [httpBatchLink({ url })],
  transformer: superjson,
});

export const withNextTRPC = ({ children }: PropsWithChildren) => (
  <apiReact.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </apiReact.Provider>
);