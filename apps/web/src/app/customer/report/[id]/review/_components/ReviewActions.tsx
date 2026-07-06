import Link from "next/link";
import { Button, buttonVariants } from "@/shared/ui/Button";

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReviewActions({
  reportId,
  isSubmittable,
  submitting,
}: {
  reportId: string;
  isSubmittable: boolean;
  submitting: boolean;
}) {
  const detailHref = `/customer/report/${reportId}`;

  return (
    <>
      <div className="hidden justify-end gap-2 lg:flex">
        <Link href={detailHref} className={buttonVariants({ variant: "outline", size: "md" })}>
          나중에 쓰기
        </Link>
        <Button type="submit" variant="gold" size="md" disabled={!isSubmittable} loading={submitting} icon={<SendIcon />}>
          리뷰 등록
        </Button>
      </div>

      <div className="flex flex-col items-center gap-3 lg:hidden">
        <Button type="submit" variant="gold" size="lg" full disabled={!isSubmittable} loading={submitting} icon={<SendIcon />}>
          리뷰 등록
        </Button>
        <p className="text-[0.8125rem] text-ink-3">등록한 리뷰는 마이페이지에서 30일 내 수정·삭제할 수 있어요</p>
      </div>
    </>
  );
}
