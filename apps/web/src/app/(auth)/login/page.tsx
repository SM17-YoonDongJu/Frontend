"use client";

import { useState } from "react";
import { useIsMobile } from "../_shared/hooks/use-is-mobile";
import { useRecentLogin } from "../_shared/hooks/use-recent-login";
import { DesktopLogin } from "./_components/DesktopLogin";
import { MobileLogin } from "./_components/MobileLogin";
import type { SocialProvider } from "./_components/SocialLoginButtons";
import { useSocialLogin } from "./_hooks/use-social-login";

export default function LoginPage() {
  const { recentLogin } = useRecentLogin();
  const { startLogin } = useSocialLogin();
  const isMobile = useIsMobile();
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);

  const handleSelect = (provider: SocialProvider) => {
    setPendingProvider(provider);
    startLogin(provider);
  };

  const mode = recentLogin ? "returning" : "first";

  if (isMobile) {
    return <MobileLogin mode={mode} onSelect={handleSelect} pendingProvider={pendingProvider} />;
  }

  return (
    <DesktopLogin
      mode={mode}
      recentLogin={recentLogin}
      onSelect={handleSelect}
      onRecentSelect={handleSelect}
      pendingProvider={pendingProvider}
    />
  );
}
