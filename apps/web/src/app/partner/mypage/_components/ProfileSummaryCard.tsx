import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import type { MypageProfile } from "../_model/types";

interface ProfileSummaryCardProps {
  profile: MypageProfile;
  licenseNo: string;
}

export function ProfileSummaryCard({ profile, licenseNo }: ProfileSummaryCardProps) {
  const certificated = profile.role === "CERTIFICATED_ADJUSTER";

  return (
    <section className="flex items-center gap-4 rounded-card-lg bg-navy p-4 md:gap-5.5 md:p-6.5">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-card bg-white/10 md:size-21">
        <span className="font-serif text-[1.5rem] font-bold text-gold-2 md:text-[2.25rem]">
          {profile.nickname.charAt(0)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2.5">
          <h2 className="font-serif text-[1.125rem] font-bold text-white md:text-[1.5rem]">
            {profile.nickname} <span className="md:hidden">사정사</span>
            <span className="hidden md:inline">손해사정사</span>
          </h2>
          {certificated && (
            <>
              <ShieldCheck className="text-[0.9375rem] text-gold-2 md:hidden" />
              <span className="hidden items-center gap-1.5 rounded-pill bg-gold-2 px-2.5 py-1 text-[0.75rem] font-semibold text-navy md:inline-flex">
                <ShieldCheck className="text-[0.8125rem]" />
                자격 인증
              </span>
            </>
          )}
        </div>

        <p className="mt-1 truncate text-[0.8125rem] text-white/85 md:mt-1.5 md:text-[0.875rem]">
          경력 {profile.career}년 ·{" "}
          <span className="hidden md:inline">{profile.specialties.join(" · ")} 전문 · </span>
          등록번호 {licenseNo}
        </p>
        <p className="mt-1 hidden truncate text-[0.8125rem] text-white/55 md:block">
          {profile.email} · {profile.activityRegion}
        </p>
      </div>

      <Link
        href="/partner/profile/edit"
        className={`${buttonVariants({ variant: "gold", size: "sm" })} shrink-0 md:hidden`}
      >
        수정
      </Link>
    </section>
  );
}
