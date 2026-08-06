import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { Button } from "@/shared/ui/Button";
import type { ApplyAdjusterErrorCode } from "../_api/use-apply-adjuster";

interface SubmitErrorNoticeProps {
  code: ApplyAdjusterErrorCode;
  onGoStatus: () => void;
}

const MESSAGES: Record<ApplyAdjusterErrorCode, string> = {
  DUPLICATE_RESOURCE: "이미 자격 인증을 신청하셨어요. 심사 현황에서 진행 상태를 확인할 수 있어요.",
  EXTERNAL_API_ERROR: "서류 업로드에 문제가 있어요. 파일을 다시 확인해 주세요.",
  MISSING_REQUIRED_FIELD: "필수 항목을 다시 확인해 주세요.",
  VALIDATION_ERROR: "입력 형식을 다시 확인해 주세요.",
};

/** 제출 실패 안내 배너. 409(이미 신청)면 심사 현황으로 유도. */
export function SubmitErrorNotice({ code, onGoStatus }: SubmitErrorNoticeProps) {
  const isDuplicate = code === "DUPLICATE_RESOURCE";
  return (
    <div className="flex flex-col gap-3 rounded-card border border-terra bg-terra-soft/50 px-[1.125rem] py-4">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 shrink-0 text-[1.125rem] text-terra" />
        <p className="break-keep text-[0.84375rem] leading-relaxed text-ink-2">{MESSAGES[code]}</p>
      </div>
      {isDuplicate && (
        <Button variant="outline" size="sm" onClick={onGoStatus} className="self-start">
          심사 현황 보기
        </Button>
      )}
    </div>
  );
}
