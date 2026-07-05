import { Scale } from "@/shared/ui/icons/Scale";
import { Button } from "@/shared/ui/Button";

interface AdjusterNoticeProps {
  onClose: () => void;
  onProceed: () => void;
}

/**
 * 손해사정사 선택 시 자격 인증 안내 다이얼로그.
 * 이동 대상(자격 인증 페이지)은 별도 이슈 — onProceed는 placeholder.
 */
export function AdjusterNotice({ onClose, onProceed }: AdjusterNoticeProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="adjuster-notice-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-6"
    >
      <div className="w-full max-w-[26rem] rounded-card-lg bg-card p-7">
        <div className="flex size-14 items-center justify-center rounded-card bg-gold-soft text-[1.75rem] text-gold-ink">
          <Scale />
        </div>
        <h2 id="adjuster-notice-title" className="mt-4 font-serif text-xl font-bold text-ink">
          자격 인증이 필요해요
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          손해사정사로 활동하려면 자격 인증을 먼저 완료해야 해요. 자격 인증 페이지로 이동해
          진행할 수 있어요.
        </p>

        <div className="mt-6 flex gap-2.5">
          <Button variant="outline" full onClick={onClose}>
            다시 선택
          </Button>
          <Button variant="gold" full onClick={onProceed}>
            자격 인증하기
          </Button>
        </div>
      </div>
    </div>
  );
}
