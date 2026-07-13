import type { ReactNode } from "react";
import { Kakao } from "@/shared/ui/icons/Kakao";
import { Naver } from "@/shared/ui/icons/Naver";
import { Button } from "@/shared/ui/Button";
import type { SocialProvider } from "../../_shared/hooks/use-recent-login";

export type { SocialProvider };

interface SocialLoginButtonsProps {
  /** 첫 로그인은 "~로 시작하기", 재로그인은 "~로 계속하기" */
  mode: "first" | "returning";
  onSelect: (provider: SocialProvider) => void;
  /** 인가 리다이렉트 진행 중인 provider (버튼 로딩 표시) */
  pendingProvider?: SocialProvider | null;
  /** desktop: 배지 인라인·rounded-xl / mobile: 배지 좌측 고정·h-14 rounded-[0.875rem] (Figma 663-4211) */
  layout?: "desktop" | "mobile";
}

interface ProviderSpec {
  provider: SocialProvider;
  name: string;
  button: string;
  badge: string;
  icon: ReactNode;
}

const PROVIDERS: ProviderSpec[] = [
  {
    provider: "kakao",
    name: "카카오",
    button: "bg-kakao text-kakao-ink",
    badge: "bg-kakao-ink text-kakao",
    icon: <Kakao className="size-3.5" />,
  },
  {
    provider: "naver",
    name: "네이버",
    button: "bg-naver text-white",
    badge: "bg-white text-naver",
    icon: <Naver className="size-3" />,
  },
];

/** 카카오·네이버 소셜 로그인 버튼 묶음. Button 재사용 + 브랜드 색은 className 조합. */
export function SocialLoginButtons({
  mode,
  onSelect,
  pendingProvider,
  layout = "desktop",
}: SocialLoginButtonsProps) {
  const action = mode === "first" ? "시작하기" : "계속하기";
  const isMobile = layout === "mobile";

  const containerClass = isMobile ? "flex w-full flex-col gap-3" : "flex w-full flex-col gap-[0.6875rem]";
  const buttonClass = isMobile
    ? "relative h-14 rounded-[0.875rem] px-4 text-[0.9375rem] font-bold"
    : "gap-2.5 rounded-xl p-4 text-[0.9375rem] font-bold";
  const badgeClass = isMobile
    ? "absolute left-5 flex size-[1.375rem] items-center justify-center rounded-[0.375rem]"
    : "flex size-[1.375rem] items-center justify-center rounded-[0.6875rem]";

  return (
    <div className={containerClass}>
      {PROVIDERS.map(({ provider, name, button, badge, icon }) => (
        <Button
          key={provider}
          full
          loading={pendingProvider === provider}
          disabled={!!pendingProvider && pendingProvider !== provider}
          onClick={() => onSelect(provider)}
          className={`${buttonClass} ${button}`}
          iconLeft={<span className={`${badgeClass} ${badge}`}>{icon}</span>}
        >
          {`${name}로 ${action}`}
        </Button>
      ))}
    </div>
  );
}
