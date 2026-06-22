import type { ReactNode } from "react";
import type { Hospitalization } from "../_model/types";

const NOT_PROVIDED = "-";

function toManwon(won: number | null): string {
  if (won == null) return NOT_PROVIDED;
  return `${Math.round(won / 10_000).toLocaleString("ko-KR")}만원`;
}

function periodDays(start: string | null, end: string | null): number | null {
  if (!start || !end) return null;
  const startDate = new Date(start.replace(/\./g, "-"));
  const endDate = new Date(end.replace(/\./g, "-"));
  const days = Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1;
  return !Number.isNaN(days) && days > 0 ? days : null;
}

export interface ClaimInfoSectionProps {
  accidentType: string;
  treatment: string;
  accidentDate: string;
  hospitalizations: Hospitalization[];
  offeredAmount: number | null;
  insuranceName: string | null;
  applicableGuarantees: string[];
}

export function ClaimInfoSection({
  accidentType,
  treatment,
  accidentDate,
  hospitalizations,
  offeredAmount,
  insuranceName,
  applicableGuarantees,
}: ClaimInfoSectionProps) {
  const totalDays = hospitalizations.reduce(
    (sum, h) => sum + (periodDays(h.hospitalStart, h.hospitalEnd) ?? 0),
    0,
  );

  const hospitalNode: ReactNode =
    hospitalizations.length === 0 || totalDays === 0 ? (
      NOT_PROVIDED
    ) : (
      <span className="group relative inline-block cursor-help underline decoration-line decoration-dotted underline-offset-4">
        총 {totalDays}일{hospitalizations.length > 1 && ` · ${hospitalizations.length}회`}
        <span
          role="tooltip"
          className="invisible absolute left-0 top-full z-30 mt-2 w-max max-w-[280px] rounded-card border border-line bg-card p-3 text-left text-[12.5px] font-normal opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
        >
          {hospitalizations.map((h, index) => {
            const days = periodDays(h.hospitalStart, h.hospitalEnd);
            return (
              <span
                key={index}
                className={index > 0 ? "mt-2 block border-t border-line-2 pt-2" : "block"}
              >
                <span className="block font-semibold text-ink">
                  {h.hospitalStart ?? "?"} ~ {h.hospitalEnd ?? "?"}
                  {days ? ` (${days}일)` : ""}
                </span>
                {h.hospitalReason && (
                  <span className="mt-0.5 block text-ink-3">{h.hospitalReason}</span>
                )}
              </span>
            );
          })}
        </span>
      </span>
    );

  const fields: { kicker: string; value: ReactNode }[] = [
    { kicker: "사고 유형", value: accidentType },
    { kicker: "진단명", value: treatment },
    { kicker: "사고 발생일", value: accidentDate },
    { kicker: "입원 · 퇴원", value: hospitalNode },
    { kicker: "제안받은 보험금", value: toManwon(offeredAmount) },
    { kicker: "가입 보험", value: insuranceName ?? applicableGuarantees[0] ?? NOT_PROVIDED },
  ];

  return (
    <dl className="grid grid-cols-1 gap-px rounded-card border border-line bg-line sm:grid-cols-3">
      {fields.map((field) => (
        <div key={field.kicker} className="bg-card p-4">
          <dt className="text-[12.5px] text-ink-3">{field.kicker}</dt>
          <dd className="mt-1.5 text-[15px] font-semibold text-ink">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
