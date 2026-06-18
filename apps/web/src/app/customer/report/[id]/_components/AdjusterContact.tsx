import { Button } from "@/shared/ui/Button";

export interface AdjusterContactProps {
  nickname?: string | null;
}

export function AdjusterContact({ nickname }: AdjusterContactProps) {
  if (!nickname) return null;

  return (
    <div className="rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-gold-soft text-[15px] font-semibold text-gold-ink">
          {nickname.slice(0, 1)}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-ink">{nickname} 손해사정사</p>
          <p className="text-[12.5px] text-ink-3">이 의견을 작성한 전문가</p>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
        이 의견으로 상담을 시작하세요. 사건 맥락을 이미 파악하고 있어 더 빠르게 진행됩니다.
      </p>

      <Button
        full
        className="mt-4"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        이 의견으로 상담하기
      </Button>

      <p className="mt-3 text-center text-[11.5px] text-ink-3">
        보수 기준은 상담 시 사전 안내됩니다.
      </p>
    </div>
  );
}
