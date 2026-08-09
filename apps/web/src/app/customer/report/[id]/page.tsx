import { ReportDetailBoundary } from "./_components/ReportDetailBoundary";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportDetailBoundary reportId={id} />;
}
