import type { Metadata } from "next";
import { WithdrawNotice } from "./_components/WithdrawNotice";
import { WithdrawPanel } from "./_components/WithdrawPanel";

export const metadata: Metadata = {
  title: "회원 탈퇴",
};

export default function WithdrawPage() {
  return (
    <main className="mx-auto w-full max-w-md px-5 py-10">
      <p className="text-[0.75rem] font-semibold text-gold-ink">내 정보</p>
      <h1 className="mt-1 font-serif text-[1.5rem] font-bold text-ink">회원 탈퇴</h1>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-2">
        탈퇴하기 전에 아래 내용을 확인해 주세요.
      </p>

      <div className="mt-5 rounded-card-lg border border-line bg-card p-5">
        <WithdrawNotice />
        <WithdrawPanel />
      </div>
    </main>
  );
}
