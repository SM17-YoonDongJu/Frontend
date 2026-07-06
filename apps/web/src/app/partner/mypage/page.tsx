import { MypageBoundary } from "./_components/MypageBoundary";

export default function MypagePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <h1 className="font-serif text-[1.75rem] font-bold text-ink">내 정보</h1>
      <MypageBoundary />
    </div>
  );
}
