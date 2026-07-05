import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import type { MypageProfile } from "../_model/types";

interface ProfileSummaryCardProps {
  profile: MypageProfile;
  licenseNo: string;
}

export function ProfileSummaryCard({ profile, licenseNo }: ProfileSummaryCardProps) {
  return (
    <section className="flex items-center gap-5.5 rounded-card-lg bg-navy p-6.5">
      <div className="flex size-21 shrink-0 items-center justify-center rounded-card bg-white/10">
        <span className="font-serif text-[2.25rem] font-bold text-gold-2">
          {profile.nickname.charAt(0)}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="font-serif text-[1.5rem] font-bold text-white">
            {profile.nickname} 손해사정사
          </h2>
          {profile.role === "CERTIFICATED_ADJUSTER" && (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-gold-2 px-2.5 py-1 text-[0.75rem] font-semibold text-navy">
              <ShieldCheck className="text-[0.8125rem]" />
              자격 인증
            </span>
          )}
        </div>

        <p className="mt-1.5 truncate text-[0.875rem] text-white/85">
          경력 {profile.career}년 · {profile.specialties.join(" · ")} 전문 · 등록번호 {licenseNo}
        </p>
        <p className="mt-1 truncate text-[0.8125rem] text-white/55">
          {profile.email} · {profile.activityRegion}
        </p>
      </div>
    </section>
  );
}
