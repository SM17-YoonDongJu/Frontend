import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Kakao } from "@/shared/ui/icons/Kakao";
import { Naver } from "@/shared/ui/icons/Naver";
import type { RecentLogin } from "../../_shared/hooks/use-recent-login";
import type { SocialProvider } from "./SocialLoginButtons";

interface RecentLoginCardProps {
  recentLogin: RecentLogin;
  onSelect: (provider: SocialProvider) => void;
}

const PROVIDER_META: Record<SocialProvider, { label: string; badge: string; icon: React.ReactNode }> = {
  kakao: { label: "카카오", badge: "bg-kakao text-kakao-ink", icon: <Kakao className="size-4" /> },
  naver: { label: "네이버", badge: "bg-white text-naver", icon: <Naver className="size-3.5" /> },
};

function formatLoginDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

/** 최근 로그인 수단 카드. 클릭 시 해당 소셜 로그인으로 바로 재진입. */
export function RecentLoginCard({ recentLogin, onSelect }: RecentLoginCardProps) {
  const { provider, maskedEmail, lastLoginAt } = recentLogin;
  const { label, badge, icon } = PROVIDER_META[provider];
  const account = maskedEmail ? `${label} · ${maskedEmail}` : label;

  return (
    <button
      type="button"
      onClick={() => onSelect(provider)}
      className="flex w-full items-center gap-3 rounded-xl border border-gold-2 bg-gold-soft px-4 py-3.5 text-left transition hover:brightness-[.97]"
    >
      <span className={`flex size-9 items-center justify-center rounded-full ${badge}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.8rem] font-bold text-ink">{account}</span>
        <span className="block text-[0.6875rem] text-gold-ink">마지막 로그인 {formatLoginDate(lastLoginAt)}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-ink-3" />
    </button>
  );
}
