import type { Metadata } from "next";
import { ReceivedProposalsBoundary } from "./_components/ReceivedProposalsBoundary";

export const metadata: Metadata = {
  title: "받은 제안",
};

export default function ReceivedProposalsPage() {
  return <ReceivedProposalsBoundary />;
}
