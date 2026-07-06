import type { ReactNode } from "react";
import { CustomerHeader } from "@/shared/ui/CustomerHeader";
import { Footer } from "@/shared/ui/Footer";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="hidden md:block">
        <CustomerHeader />
      </div>
      <main className="flex-1">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
