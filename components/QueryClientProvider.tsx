"use client";

import { QueryClientProvider as TanStackProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import type { ReactNode } from "react";

export function QueryClientProvider({ children }: { children: ReactNode }) {
  return (
    <TanStackProvider client={queryClient}>{children}</TanStackProvider>
  );
}
