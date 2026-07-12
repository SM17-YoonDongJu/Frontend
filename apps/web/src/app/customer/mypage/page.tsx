import { MypageBoundary } from "./_components/MypageBoundary";

/** 고객 마이페이지 「내 정보」 셸(Server). 브레드크럼·H1은 PC만, 모바일 헤더는 뷰 내부. */
export default function CustomerMypagePage() {
  return (
    <div className="mx-auto w-full max-w-[71.25rem] md:px-15 md:py-12">
      <header className="hidden md:mb-8 md:block">
        <p className="text-[0.875rem] font-bold text-gold-ink">마이페이지</p>
        <h1 className="mt-2 font-serif text-[2rem] font-bold text-ink">내 정보</h1>
      </header>
      <MypageBoundary />
    </div>
  );
}
