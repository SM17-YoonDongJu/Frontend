import { ReviewForm } from "./_components/ReviewForm";

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewForm reportId={id} />;
}
