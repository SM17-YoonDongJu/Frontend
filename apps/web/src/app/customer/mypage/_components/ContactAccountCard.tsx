import type { Me } from "../_model/types";
import { socialAccountLabel } from "../_model/profile-format";
import { ComingSoonButton } from "./ComingSoonButton";

interface ContactAccountCardProps {
  profile: Me;
  onEdit: () => void;
}

const ACTION_CLASS =
  "shrink-0 rounded-chip border border-line bg-card px-3.5 py-1.5 text-[0.8125rem] font-bold text-ink-2 transition hover:bg-paper";

/** PC 연락처·계정 카드 — 휴대폰(변경→프로필 설정)/이메일(표시 전용)/소셜(관리·추후 지원) 3행. */
export function ContactAccountCard({ profile, onEdit }: ContactAccountCardProps) {
  const rows = [
    {
      label: "휴대폰",
      value: profile.phone ?? "미등록",
      action: (
        <button type="button" onClick={onEdit} className={ACTION_CLASS}>
          변경
        </button>
      ),
    },
    {
      label: "이메일",
      value: profile.email ?? "미등록",
      action: null,
    },
    {
      label: "연결된 소셜",
      value: socialAccountLabel(profile.socialProvider),
      action: <ComingSoonButton className={ACTION_CLASS}>관리</ComingSoonButton>,
    },
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
            {row.action}
          </li>
        ))}
      </ul>
    </section>
  );
}
