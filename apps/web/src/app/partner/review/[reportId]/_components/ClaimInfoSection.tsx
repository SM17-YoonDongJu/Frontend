import type { ReactNode } from "react";
import { formatManwon } from "@/shared/lib/format-amount";

const NOT_PROVIDED = "-";

function toManwon(won: number | null): string {
  if (won == null) return NOT_PROVIDED;
  return `${formatManwon(won)}만원`;
}

export interface ClaimInfoSectionProps {
  accidentType: string;
  diagnosis: string;
  accidentDate: string;
  hospitalization: string | null;
  offeredAmount: number | null;
  insurerName: string | null;
  productName: string | null;
  applicableGuarantees: string[];
}

export function ClaimInfoSection({
  accidentType,
  diagnosis,
  accidentDate,
  hospitalization,
  offeredAmount,
  insurerName,
  productName,
  applicableGuarantees,
}: ClaimInfoSectionProps) {
  const insurance =
    [insurerName, productName].filter(Boolean).join(" · ") ||
    applicableGuarantees[0] ||
    NOT_PROVIDED;

  const fields: { kicker: string; value: ReactNode }[] = [
    { kicker: "사고 유형", value: accidentType },
    { kicker: "진단명", value: diagnosis },
    { kicker: "사고 발생일", value: accidentDate },
    { kicker: "입원 · 퇴원", value: hospitalization ?? NOT_PROVIDED },
    { kicker: "제안받은 보험금", value: toManwon(offeredAmount) },
    { kicker: "가입 보험", value: insurance },
  ];

  return (
    <dl className="grid grid-cols-1 gap-px rounded-card border border-line bg-line sm:grid-cols-3">
      {fields.map((field) => (
        <div key={field.kicker} className="bg-card p-4">
          <dt className="text-[0.78125rem] text-ink-3">{field.kicker}</dt>
          <dd className="mt-1.5 text-[0.9375rem] font-semibold text-ink">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
