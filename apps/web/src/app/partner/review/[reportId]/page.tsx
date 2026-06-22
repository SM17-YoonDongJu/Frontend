import { ReviewDetailBoundary } from "./_components/ReviewDetailBoundary";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  // reportId 변경 시 초안/리듀서 상태가 init-1회라 잔류 → key로 서브트리 재마운트.
  return <ReviewDetailBoundary key={reportId} reportId={reportId} />;
}
