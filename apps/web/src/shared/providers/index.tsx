import type { ReactNode } from "react";
import { MockProvider } from "@/shared/mocks/mock-provider";
import QueryProvider from "@/shared/providers/query-provider";
import { Toaster } from "@/shared/ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MockProvider>
      <QueryProvider>{children}</QueryProvider>
      <Toaster />
    </MockProvider>
  );
}
