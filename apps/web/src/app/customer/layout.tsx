import type { ReactNode } from "react";
import { CustomerHeader } from "@/shared/ui/CustomerHeader";
import { Footer } from "@/shared/ui/Footer";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
