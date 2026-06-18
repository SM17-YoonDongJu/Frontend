import type { ReactNode } from "react";
import { MockProvider } from "@/shared/mocks/mock-provider";
import QueryProvider from "@/shared/providers/query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MockProvider>
      <QueryProvider>{children}</QueryProvider>
    </MockProvider>
  );
}
