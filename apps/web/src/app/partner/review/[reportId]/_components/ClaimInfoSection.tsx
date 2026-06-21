import { Label } from "@/shared/ui/Label";

const NOT_PROVIDED = "-";

function toManwon(won: number | null): string {
  if (won == null) return NOT_PROVIDED;
  return `${Math.round(won / 10_000).toLocaleString("ko-KR")}만원`;
}

function formatHospitalPeriod(start: string | null, end: string | null): string {
  if (!start || !end) return NOT_PROVIDED;
  const startDate = new Date(start.replace(/\./g, "-"));
  const endDate = new Date(end.replace(/\./g, "-"));
  const days = Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1;
  const valid = !Number.isNaN(days) && days > 0;
  return valid ? `${start} ~ ${end} (${days}일)` : `${start} ~ ${end}`;
}

export interface ClaimInfoSectionProps {
  accidentType: string;
  treatment: string;
  accidentDate: string;
  hospitalStart: string | null;
  hospitalEnd: string | null;
  offeredAmount: number | null;
  applicableGuarantees: string[];
}

export function ClaimInfoSection({
  accidentType,
  treatment,
  accidentDate,
  hospitalStart,
  hospitalEnd,
  offeredAmount,
  applicableGuarantees,
}: ClaimInfoSectionProps) {
  const fields = [
    { kicker: "사고 유형", value: accidentType },
    { kicker: "진단명", value: treatment },
    { kicker: "사고 발생일", value: accidentDate },
    { kicker: "입원 · 퇴원", value: formatHospitalPeriod(hospitalStart, hospitalEnd) },
    { kicker: "제안받은 보험금", value: toManwon(offeredAmount) },
    { kicker: "가입 보험", value: applicableGuarantees[0] ?? NOT_PROVIDED },
  ];

  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
      {fields.map((field) => (
        <div key={field.kicker} className="bg-card p-4">
          <dt>
            <Label kicker>{field.kicker}</Label>
          </dt>
          <dd className="mt-1.5 text-[15px] font-semibold text-ink">{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
