import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";

/**
 * 히어로 우측 navy 미리보기 카드 + 좌하단 플로팅 칩. 정적 프레젠테이션.
 */
export function ReportPreviewCard() {
  return (
    <div className="relative w-[33.25rem]">
      <div className="rounded-card-lg bg-navy p-7 shadow-[0_1.875rem_2.1875rem_rgba(21,32,46,0.5)]">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-terra-2" />
          <span className="text-[0.8125rem] font-bold text-terra-2">검토 권장</span>
        </div>

        <p className="mt-[1.125rem] text-[0.8125rem] text-white/55">
          검토 가능한 예상 보상 범위 · 참고용 추정
        </p>

        <div className="mt-1.5 flex items-end gap-2">
          <span className="font-serif text-[2.375rem] font-bold leading-none text-white">
            1,400 – 1,750
          </span>
          <span className="text-[1.25rem] font-bold text-white/70">만원</span>
        </div>

        <div className="relative mt-7 h-2.5 rounded-tag bg-line-2">
          <div className="absolute left-[34%] top-0 h-2.5 w-[58%] rounded-tag bg-gold opacity-85" />
          <div className="absolute -top-[0.3125rem] left-[17%] h-5 w-[0.1875rem] rounded-[0.125rem] bg-ink">
            <span className="absolute -top-[1.1875rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.6875rem] font-bold text-ink">
              제안 850만
            </span>
          </div>
        </div>

        <p className="mt-[1.125rem] flex h-[2.4375rem] items-center rounded-[0.75rem] bg-white/[0.07] px-3.5 text-[0.8125rem] text-white/80">
          제안 금액이&nbsp;<b className="font-bold text-gold-2">약 550만원</b>&nbsp;낮을 수 있어요
        </p>
      </div>

      <div className="absolute -left-7 top-[13.8125rem] flex w-[10.0625rem] items-center gap-3 rounded-[0.875rem] border border-line bg-card p-3.5 shadow-[0_1rem_1.25rem_rgba(21,32,46,0.3)]">
        <span className="flex size-[2.125rem] shrink-0 items-center justify-center rounded-chip bg-green-soft text-green">
          <CheckCircle className="size-[1.125rem]" />
        </span>
        <span className="flex flex-col whitespace-nowrap">
          <span className="text-[0.8125rem] font-bold text-ink">적용 보장 3건</span>
          <span className="text-[0.6875rem] text-ink-3">누락 특약 1건 발견</span>
        </span>
      </div>
    </div>
  );
}
