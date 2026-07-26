import type { Metadata } from "next";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { WithdrawNotice } from "./_components/WithdrawNotice";
import { WithdrawPanel } from "./_components/WithdrawPanel";

export const metadata: Metadata = {
  title: "회원 탈퇴",
};

export default function WithdrawPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-paper px-5 py-10 tracking-[-0.01rem]">
      <section className="w-full max-w-md rounded-card-lg border border-line bg-card px-7 py-12 shadow-popover sm:px-11">
        <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-terra-soft text-terra">
          <AlertTriangle className="size-8" />
        </div>

        <h1 className="mt-7 text-center font-serif text-[1.375rem] font-bold text-ink">
          회원 탈퇴
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-ink-3">
          탈퇴하기 전에 아래 내용을 확인해 주세요.
        </p>

        <WithdrawNotice />
        <WithdrawPanel />
      </section>
    </main>
  );
}
