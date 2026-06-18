import { ReportDetailView } from "./_components/ReportDetailView";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportDetailView reportId={id} />;
}
