/** 약관 동의 안내 문구. 강조어는 본문보다 진한 링크 스타일. */
export function TermsNotice() {
  return (
    <p className="w-full text-center text-[0.75rem] leading-5 tracking-[-0.01rem] text-ink-3">
      가입 시 <span className="font-bold text-ink-2">이용약관</span>과{" "}
      <span className="font-bold text-ink-2">개인정보 처리방침</span>에 동의하게 됩니다.
    </p>
  );
}
