import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";

export default async function ReviewCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ caseId?: string }>;
}) {
  const { reportId } = await params;
  const { caseId } = await searchParams;
  const sentAt = new Date().toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-24 text-center">
      <span
        aria-hidden
        className="flex size-16 items-center justify-center rounded-full bg-green-soft text-3xl text-green"
      >
        ✓
      </span>
      <h1 className="mt-6 font-serif text-[22px] font-bold text-ink">
        검수 리포트를 고객에게 전송했습니다
      </h1>
      <p className="mt-2 text-[14px] text-ink-3">
        손해사정사 검수 완료 배지가 부착되어 고객 리포트에 반영됩니다.
      </p>

      <dl className="mt-8 w-full space-y-2.5 rounded-card-lg border border-line bg-card p-5 text-[14px]">
        {caseId && (
          <div className="flex items-center justify-between">
            <dt className="text-ink-3">사건 번호</dt>
            <dd className="font-semibold text-ink">#{caseId}</dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="text-ink-3">전송 시각</dt>
          <dd className="font-semibold text-ink">{sentAt}</dd>
        </div>
      </dl>

      <div className="mt-8 flex w-full flex-col gap-2.5">
        <Link
          href="/partner/review"
          className={buttonVariants({ variant: "primary", full: true })}
        >
          검수 대기 목록으로
        </Link>
        <Link
          href={`/partner/review/${reportId}`}
          className={buttonVariants({ variant: "outline", full: true })}
        >
          검수 내용 다시 보기
        </Link>
      </div>
    </div>
  );
}
