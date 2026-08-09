import Link from "next/link";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { Send } from "@/shared/ui/icons/Send";

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
        <Button type="submit" variant="gold" size="md" disabled={!isSubmittable} loading={submitting} icon={<Send className="size-[1.0625rem]" />}>
          리뷰 등록
        </Button>
      </div>

      <div className="flex flex-col items-center gap-3 lg:hidden">
        <Button type="submit" variant="gold" size="lg" full disabled={!isSubmittable} loading={submitting} icon={<Send className="size-[1.0625rem]" />}>
          리뷰 등록
        </Button>
        <p className="text-[0.8125rem] text-ink-3">등록한 리뷰는 마이페이지에서 30일 내 수정·삭제할 수 있어요</p>
      </div>
    </>
  );
}
