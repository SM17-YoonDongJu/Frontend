import type { ReactNode } from "react";
import { PublicHeader } from "@/shared/ui/PublicHeader";
import { Footer } from "@/shared/ui/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
