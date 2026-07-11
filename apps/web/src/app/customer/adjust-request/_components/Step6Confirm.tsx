"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/shared/ui/Checkbox";
import type { AdjustRequestDraft } from "../_model/types";

const TREATMENT_LABELS: Record<string, string> = {
  ADMISSION: "입원",
  OUTPATIENT: "통원",
  MEDICATION: "약제",
  SURGERY: "수술",
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-[0.8125rem] text-ink-3">{label}</span>
      <span className="text-right text-[0.875rem] font-medium text-ink">{value}</span>
    </div>
  );
}

export function Step6Confirm() {
  const { watch, setValue, formState } = useFormContext<AdjustRequestDraft>();
  const { errors } = formState;
  const v = watch();

  const stays = v.hospitalizations ?? [];
  const starts = stays.map((s) => s.start).filter(Boolean).toSorted();
  const ends = stays.map((s) => s.end).filter((x): x is string => !!x).toSorted();
  const hasOngoingStay = stays.some((s) => s.start && !s.end);
  const lastEnd = ends[ends.length - 1];
  const hospitalRange =
    starts.length > 0
      ? `${starts[0]} ~ ${hasOngoingStay ? "진행 중" : (lastEnd ?? "진행 중")}`
      : "없음";

  const treatments = (v.treatmentTypes ?? []).map((t) => TREATMENT_LABELS[t]).join(", ") || "-";
  const offered = v.insuranceNotOffered
    ? "아직 제안받지 않음"
    : v.insuranceOffered != null
      ? `${v.insuranceOffered.toLocaleString()}원`
      : "-";
  const docCount = v.documentUrls?.length ?? 0;

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-[1.5625rem] font-bold text-ink sm:text-[1.375rem]">
          분석 준비가 끝났어요
        </h2>
        <p className="mt-1.5 text-[0.84375rem] text-ink-3">
          입력하신 정보로 약관·특약·판례를 분석해 리포트를 만들어 드릴게요.
        </p>
      </div>

      <div className="rounded-card border border-line bg-paper-2 px-4 py-1">
        <SummaryRow label="사고 유형" value="실손 의료비" />
        <SummaryRow
          label="진단명"
          value={v.diagnosis?.filter(Boolean).join(", ") || "-"}
        />
        <SummaryRow label="치료 형태" value={treatments} />
        <SummaryRow label="사고 발생일" value={v.accidentDate || "-"} />
        <SummaryRow label="입원 기간" value={hospitalRange} />
        <SummaryRow label="제안받은 보험금" value={offered} />
        <SummaryRow label="가입 보험·특약" value={v.enrolledInsurance || "-"} />
        <SummaryRow label="업로드 서류" value={`${docCount}건`} />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <Checkbox
            checked={v.agreedToPrivacy ?? false}
            onChange={(c) => setValue("agreedToPrivacy", c, { shouldValidate: false })}
            label="(필수) 민감정보(진료·상해 정보) 처리에 동의합니다."
          />
          {errors.agreedToPrivacy && (
            <p className="mt-1 text-[0.75rem] font-medium text-terra">
              {errors.agreedToPrivacy.message}
            </p>
          )}
        </div>
        <div>
          <Checkbox
            checked={v.agreedToTerms ?? false}
            onChange={(c) => setValue("agreedToTerms", c, { shouldValidate: false })}
            label="(필수) 분석 결과는 참고용이며 법적 효력이 없음을 확인했습니다."
          />
          {errors.agreedToTerms && (
            <p className="mt-1 text-[0.75rem] font-medium text-terra">{errors.agreedToTerms.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
