"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const client = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      {children}
      <ProgressBar
        height="2px"
        color="#a855f7"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </QueryClientProvider>
  );
};

export default Providers;
