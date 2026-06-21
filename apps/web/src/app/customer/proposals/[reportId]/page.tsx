import { ProposalsBoundary } from "./_components/ProposalsBoundary";

export default async function ProposalsPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  return <ProposalsBoundary reportId={reportId} />;
}
