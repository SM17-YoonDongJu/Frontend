import { cn } from "@/shared/lib/utils";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Check } from "@/shared/ui/icons/Check";
import { Button } from "@/shared/ui/Button";
import type { RegisterErrorCode } from "../_api/use-register";
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
  onSubmit: () => void;
  loading: boolean;
  errorCode: RegisterErrorCode | null;
}

const ERROR_MESSAGE: Record<RegisterErrorCode, string> = {
  DUPLICATE_RESOURCE: "이미 가입된 계정이에요. 로그인으로 진행해 주세요.",
  VALIDATION_ERROR: "입력한 정보를 다시 확인해 주세요.",
  MISSING_REQUIRED_FIELD: "필수 정보가 누락됐어요. 다시 시도해 주세요.",
  EXTERNAL_API_ERROR: "소셜 인증에 실패했어요. 잠시 후 다시 시도해 주세요.",
};

/** Step2: 전체 동의 + 약관 3종 + 동의하고 가입. */
export function ConsentStep({
  consent,
  onToggle,
  onToggleAll,
  onSubmit,
  loading,
  errorCode,
}: ConsentStepProps) {
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

      {errorCode && (
        <p role="alert" className="mt-5 rounded-input bg-terra-soft px-4 py-3 text-[0.8125rem] font-medium text-terra">
          {ERROR_MESSAGE[errorCode]}
        </p>
      )}

      <Button
        full
        size="lg"
        className="mt-6"
        disabled={!canSubmit}
        loading={loading}
        onClick={onSubmit}
        icon={<ArrowRight className="text-[1.1rem]" />}
      >
        동의하고 가입
      </Button>
    </div>
  );
}
