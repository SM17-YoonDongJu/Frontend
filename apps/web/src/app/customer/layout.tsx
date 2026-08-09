import type { ReactNode } from "react";
import { getIsAppWebView } from "@/shared/lib/app-webview";
import { AppTabBar } from "@/shared/ui/AppTabBar";
import { CustomerHeader } from "@/shared/ui/CustomerHeader";
import { Footer } from "@/shared/ui/Footer";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const isApp = await getIsAppWebView();

  return (
    <div className="flex min-h-dvh flex-col">
      {!isApp && (
        <div className="hidden md:block">
          <CustomerHeader />
        </div>
      )}
      <main className="flex-1">{children}</main>
      {!isApp && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      {isApp && <AppTabBar variant="customer" />}
    </div>
  );
}
