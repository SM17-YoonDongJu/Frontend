import { ReviewDetailBoundary } from "./_components/ReviewDetailBoundary";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  return <ReviewDetailBoundary reportId={reportId} />;
}
