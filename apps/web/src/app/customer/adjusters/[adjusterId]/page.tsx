import { AdjusterProfileBoundary } from "./_components/AdjusterProfileBoundary";

export default async function AdjusterProfilePage({
  params,
}: {
  params: Promise<{ adjusterId: string }>;
}) {
  const { adjusterId } = await params;
  return <AdjusterProfileBoundary adjusterId={adjusterId} />;
}
