import type { AdjusterListMeta } from "../_model/types";

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function StatsBand({ meta }: { meta: AdjusterListMeta }) {
  const stats = [
    { value: `${numberFormatter.format(meta.totalAdjusterCount)}명+`, label: "검증 손해사정사" },
    { value: `${meta.averageRating.toFixed(1)} / 5.0`, label: "평균 평점" },
    { value: `${numberFormatter.format(meta.totalConsultCount)}건`, label: "누적 상담" },
    { value: `${meta.averageCareer}년`, label: "평균 경력" },
  ];

  return (
    <dl className="hidden grid-cols-4 divide-x divide-white/10 rounded-card-lg bg-navy px-2 py-6 md:grid">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center gap-1 px-4">
          <dd className="font-serif text-3xl font-semibold text-white">{stat.value}</dd>
          <dt className="text-[0.8125rem] text-white/60">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}
