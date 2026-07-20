import type { Me } from "../_model/types";

interface ContactAccountCardProps {
  profile: Me;
  onEdit: () => void;
}

const ACTION_CLASS =
  "shrink-0 rounded-chip border border-line bg-card px-3.5 py-1.5 text-[0.8125rem] font-bold text-ink-2 transition hover:bg-paper";

/** PC 연락처·계정 카드 — 휴대폰/지역 2행. 변경 시 프로필 설정 모달로 이동. */
export function ContactAccountCard({ profile, onEdit }: ContactAccountCardProps) {
  const rows = [
    { label: "휴대폰", value: profile.phoneNumber ?? "미등록" },
    { label: "지역", value: profile.region.length > 0 ? profile.region.join(" · ") : "미설정" },
  ];

  return (
    <section className="rounded-card border border-line bg-card p-6 shadow-[0_1px_1px_rgba(21,32,46,0.03)]">
      <h2 className="text-[1.0625rem] font-bold text-ink">연락처 · 계정</h2>

      <ul className="mt-2">
        {rows.map((row, index) => (
          <li
            key={row.label}
            className={`flex items-center justify-between py-3.5 ${
              index > 0 ? "border-t border-line-2" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="text-[0.75rem] text-ink-3">{row.label}</p>
              <p className="mt-1 truncate text-[0.875rem] font-bold text-ink">
                {row.value}
              </p>
            </div>
            <button type="button" onClick={onEdit} className={ACTION_CLASS}>
              변경
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
