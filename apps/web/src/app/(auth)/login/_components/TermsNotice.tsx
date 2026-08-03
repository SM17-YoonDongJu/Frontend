import Link from "next/link";

/** 약관 동의 안내 문구. 강조어는 약관·개인정보 처리방침 페이지로 이동하는 링크. */
export function TermsNotice() {
  return (
    <p className="w-full text-center text-[0.75rem] leading-5 tracking-[-0.01rem] text-ink-3">
      가입 시{" "}
      <Link href="/terms" className="font-bold text-ink-2 underline underline-offset-2">
        이용약관
      </Link>
      과{" "}
      <Link href="/privacy" className="font-bold text-ink-2 underline underline-offset-2">
        개인정보 처리방침
      </Link>
      에 동의하게 됩니다.
    </p>
  );
}
