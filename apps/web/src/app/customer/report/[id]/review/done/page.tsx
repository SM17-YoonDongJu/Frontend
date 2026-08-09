import { ReviewDone } from "../_components/ReviewDone";

export default async function ReviewDonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewDone reportId={id} />;
}
