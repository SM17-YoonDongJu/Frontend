import type { ReactNode } from "react";
import { LandingFooter } from "./_components/LandingFooter";
import { LandingHeader } from "./_components/LandingHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
