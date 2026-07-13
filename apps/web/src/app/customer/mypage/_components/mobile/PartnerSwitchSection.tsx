import Link from "next/link";
import type { UserRole } from "../../_model/types";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { Scale } from "@/shared/ui/icons/Scale";

interface PartnerSwitchSectionProps {
  role: UserRole | null;
}

/** 파트너 전환 — 인증 손해사정사(CERTIFICATED_ADJUSTER)에게만 노출. */
export function PartnerSwitchSection({ role }: PartnerSwitchSectionProps) {
  if (role !== "CERTIFICATED_ADJUSTER") return null;

  return (
    <section>
      <div className="mb-2 flex items-center gap-1.5 px-1">
        <Scale className="size-3.5 text-gold-ink" />
        <h2 className="text-[0.8125rem] font-bold text-gold-ink">손해사정사 인증됨</h2>
      </div>
      <Link
        href="/partner"
        className="flex items-center gap-3 rounded-card border border-line bg-card p-4 transition hover:bg-paper-2"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-button bg-gold-soft text-gold-ink">
          <Scale className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[0.9375rem] font-bold text-ink">
            파트너 모드로 전환
          </span>
          <span className="mt-0.5 block truncate text-[0.75rem] text-ink-3">
            검수·상담 등 손해사정사 화면으로 이동
          </span>
        </span>
        <ChevronRight className="size-[1.125rem] shrink-0 text-ink-3" />
      </Link>
    </section>
  );
}
