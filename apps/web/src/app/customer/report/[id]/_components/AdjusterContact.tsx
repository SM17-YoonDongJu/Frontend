import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";

/** 프로필이 있으면 사정사 프로필 링크로, 없으면 링크 없이 같은 레이아웃으로 감싼다. */
function ProfileLinkWrapper({ href, children }: { href: string | null; children: ReactNode }) {
  const layout = "flex items-center gap-3";
  if (!href) return <div className={layout}>{children}</div>;

  return (
    <Link href={href} className={cn(layout, "transition hover:opacity-80")}>
      {children}
    </Link>
  );
}

export interface AdjusterContactProps {
  nickname?: string | null;
  adjusterId?: string | null;
  variant?: "mobile" | "desktop";
}

export function AdjusterContact({
  nickname,
  adjusterId,
  variant = "desktop",
}: AdjusterContactProps) {
  if (!nickname) return null;

  const chatHref = adjusterId ? `/customer/chat?adjusterId=${adjusterId}` : null;
  const profileHref = adjusterId ? `/customer/adjusters/${adjusterId}` : null;
  const avatarChar = nickname.slice(0, 1);

  if (variant === "mobile") {
    return (
      <div className="rounded-card-lg border border-line bg-paper-2 p-[1.3125rem]">
        <ProfileLinkWrapper href={profileHref}>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-[1.5rem] bg-navy font-serif text-[1.26rem] text-white">
            {avatarChar}
          </div>
          <div>
            <p className="text-[0.86rem] font-bold text-ink">{nickname} 손해사정사</p>
            <p className="text-[0.73rem] text-ink-3">이 리포트를 검수한 전문가</p>
          </div>
        </ProfileLinkWrapper>

        <p className="mt-[0.8125rem] text-[0.73rem] leading-[1.21rem] text-ink-2">
          검수해주신 사정사님께 바로 상담을 이어가세요. 사건을 이미 파악하고 있어 더 빠릅니다.
        </p>

        {chatHref && (
          <Link
            href={chatHref}
            className={cn(buttonVariants({ full: true }), "mt-[0.8125rem] py-4 text-[0.94rem]")}
          >
            {nickname} 사정사님께 연결하기
            <ArrowRight className="text-[1.1875rem]" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-card-lg border border-line bg-card p-6">
      <ProfileLinkWrapper href={profileHref}>
        <div className="flex size-11 items-center justify-center rounded-full bg-gold-soft text-[0.9375rem] font-semibold text-gold-ink">
          {avatarChar}
        </div>
        <div>
          <p className="text-[0.9375rem] font-semibold text-ink">{nickname} 손해사정사</p>
          <p className="text-[0.78rem] text-ink-3">이 의견을 작성한 전문가</p>
        </div>
      </ProfileLinkWrapper>

      <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-2">
        이 의견으로 상담을 시작하세요. 사건 맥락을 이미 파악하고 있어 더 빠르게 진행됩니다.
      </p>

      {chatHref && (
        <Link href={chatHref} className={cn(buttonVariants({ full: true }), "mt-4")}>
          이 의견으로 상담하기
          <ArrowRight className="text-[1rem]" />
        </Link>
      )}
    </div>
  );
}
