import { StatusBadge } from "@/shared/ui/StatusBadge";
import { User } from "@/shared/ui/icons/User";
import type { ReviewClient } from "../_model/types";

export interface ClientAccidentSectionProps {
  client: ReviewClient;
  isMasked: boolean;
  description: string | null;
}

export function ClientAccidentSection({
  client,
  isMasked,
  description,
}: ClientAccidentSectionProps) {
  const initial = client.maskedName.charAt(0);

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-serif text-[17px] font-bold text-ink">
          <User className="text-ink-3" />
          의뢰인 정보 · 사고 내용
        </h2>
        {isMasked && <StatusBadge tone="green">민감정보 비식별</StatusBadge>}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-card border border-line-2 bg-paper-2 p-4">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-lg text-gold"
        >
          {initial}
        </span>
        <div className="text-[14px]">
          <p className="font-semibold text-ink">
            {client.maskedName} · {client.ageBand} · {client.gender}
          </p>
          <p className="mt-0.5 text-ink-3">
            {client.region} · 가입 {client.joinedAt}
          </p>
        </div>
      </div>

      {description && (
        <div className="mt-4">
          <p className="text-[12.5px] font-semibold text-ink-3">의뢰인이 작성한 사고 경위</p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{description}</p>
        </div>
      )}
    </section>
  );
}
