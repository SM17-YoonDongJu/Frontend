import { cn } from "@/shared/lib/utils";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Check } from "@/shared/ui/icons/Check";
import { Button } from "@/shared/ui/Button";
import {
  CONSENT_ITEMS,
  isRequiredConsentMet,
  type ConsentState,
} from "../_model/consent-config";
import type { TermsType } from "../_shared/model/terms";
import { ConsentCheckItem } from "./ConsentCheckItem";

interface ConsentStepProps {
  consent: ConsentState;
  onToggle: (type: TermsType, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  /** 필수 약관 충족 시 다음 단계(본인 확인)로 이동 */
  onNext: () => void;
}

/** Step2: 전체 동의 + 약관 3종. 가입 요청은 본인 확인 스텝(#173)에서 수행. */
export function ConsentStep({ consent, onToggle, onToggleAll, onNext }: ConsentStepProps) {
  const allChecked = CONSENT_ITEMS.every((item) => consent[item.type]);
  const canSubmit = isRequiredConsentMet(consent);

  return (
    <div>
      <h1 className="font-serif text-[1.5rem] font-bold text-ink">약관에 동의해주세요</h1>
      <p className="mt-2 text-sm text-ink-3">서비스 이용을 위해 아래 항목에 동의가 필요해요.</p>

      <button
        type="button"
        onClick={() => onToggleAll(!allChecked)}
        className="mt-6 flex w-full items-center gap-3 rounded-input border border-line bg-paper-2 px-4 py-4 text-left transition hover:brightness-[.98]"
      >
        <span
          aria-hidden
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-tag border transition",
            allChecked ? "border-ink bg-ink text-white" : "border-line bg-card text-transparent",
          )}
        >
          <Check className="text-[0.8rem]" />
        </span>
        <span className="text-[0.9375rem] font-bold text-ink">전체 동의</span>
      </button>

      <div className="mt-4 flex flex-col px-1">
        {CONSENT_ITEMS.map((item) => (
          <ConsentCheckItem
            key={item.type}
            item={item}
            checked={consent[item.type]}
            onToggle={(checked) => onToggle(item.type, checked)}
            detailHref={`/signup/terms/${item.type}`}
          />
        ))}
      </div>

      <Button
        full
        size="lg"
        className="mt-6"
        disabled={!canSubmit}
        onClick={onNext}
        icon={<ArrowRight className="text-[1.1rem]" />}
      >
        다음
      </Button>
    </div>
  );
}
