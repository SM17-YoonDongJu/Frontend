import type { ReactNode } from "react";
import { getIsAppWebView } from "@/shared/lib/app-webview";
import { LandingFooter } from "./_components/LandingFooter";
import { LandingHeader } from "./_components/LandingHeader";
import { PublicChromeGate } from "./_components/PublicChromeGate";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const isApp = await getIsAppWebView();

  return (
    <PublicChromeGate>
      <div className="flex min-h-dvh flex-col bg-paper">
        {!isApp && <LandingHeader />}
        <main className="flex-1">{children}</main>
        {!isApp && <LandingFooter />}
      </div>
    </PublicChromeGate>
  );
}
