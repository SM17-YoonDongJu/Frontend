import { SharedReportBoundary } from "./_components/SharedReportBoundary";

export default async function SharedReportPage({
  params,
}: {
  params: Promise<{ chatRoomId: string }>;
}) {
  const { chatRoomId } = await params;
  return <SharedReportBoundary chatRoomId={chatRoomId} />;
}
