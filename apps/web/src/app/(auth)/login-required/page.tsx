import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/Button";
import { Scale } from "@/shared/ui/icons/Scale";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";

export const metadata: Metadata = {
  title: "로그인 필요",
};

export default function LoginRequiredPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper px-5 py-10 tracking-[-0.01rem]">
      <section className="w-full max-w-md rounded-card-lg border border-line bg-card px-7 py-12 text-center shadow-[0_1.75rem_3.5rem_-2.25rem_rgba(24,39,64,0.4)] sm:px-11">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-gold text-white">
          <Scale className="size-8" />
        </div>

        <h1 className="mt-7 font-serif text-[1.375rem] font-bold leading-[1.9rem] text-ink">
          <span className="block">서비스를 이용하시려면</span>
          <span className="block">로그인이 필요합니다</span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-3">
          소셜 계정으로 간편하게 로그인하고
          <span className="block">하시던 작업을 이어가세요.</span>
        </p>

        <Link href="/login" className={cn(buttonVariants({ full: true, size: "lg" }), "mt-7")}>
          로그인하러 가기
        </Link>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gold-soft px-4 py-3">
          <ShieldCheck className="size-[1.0625rem] shrink-0 text-gold-ink" />
          <p className="break-keep text-[0.73rem] leading-[1.21rem] text-gold-ink">
            로그인 후 보시던 페이지로 다시 안내해 드릴게요.
          </p>
        </div>

        <div className="mt-8 border-t border-line-2 pt-5">
          <Link
            href="/"
            className="text-[0.8125rem] font-medium text-ink-3 transition hover:text-ink-2"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
