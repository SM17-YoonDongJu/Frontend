import { Avatar } from "@/shared/ui/Avatar";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { User } from "@/shared/ui/icons/User";
import type { ReviewClient } from "../_model/types";

export interface ClientAccidentSectionProps {
  client: ReviewClient;
  isMasked: boolean;
}

export function ClientAccidentSection({ client, isMasked }: ClientAccidentSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-serif text-[1.0625rem] font-bold text-ink">
          <User className="text-ink-3" />
          의뢰인 정보 · 사고 내용
        </h2>
        {isMasked && <StatusBadge tone="green">민감정보 비식별</StatusBadge>}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-card border border-line-2 bg-paper-2 p-4">
        <Avatar
          name={client.maskedName}
          tone="gold"
          className="text-[3rem] [--avatar-initial:0.375em]"
        />
        <div className="text-[0.875rem]">
          <p>
            <span className="font-semibold text-ink">{client.maskedName}</span>
            <span className="text-ink-3"> · {client.ageBand} · {client.gender}</span>
          </p>
          <p className="mt-0.5 text-ink-3">
            {client.region} · 가입 {client.joinedAt}
          </p>
        </div>
      </div>
    </div>
  );
}
