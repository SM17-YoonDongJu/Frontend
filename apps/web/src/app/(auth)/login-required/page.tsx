import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";

export const metadata: Metadata = {
  title: "로그인 필요",
};

export default function LoginRequiredPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-[1.125rem] font-semibold text-ink">
        서비스를 이용하시려면 로그인이 필요합니다
      </h1>
      <p className="text-sm leading-6 text-ink-3">
        로그인 후 보시던 페이지로 다시 안내해 드릴게요.
      </p>
      <Link href="/login" className={buttonVariants({ full: true })}>
        로그인하러 가기
      </Link>
    </main>
  );
}
