import "@/shared/api/client";
import { proposals as proposalsRequest } from "@/shared/api/generated/sdk.gen";
import { proposalListSchema } from "../model/proposal.schema";
import type { ProposalList } from "../model/proposal.schema";

export async function getProposalList(
  reportId: string,
  page = 1,
  size = 10,
): Promise<ProposalList> {
  const { data } = await proposalsRequest({
    throwOnError: true,
    path: { reportId },
    query: { page, size },
  });
  return proposalListSchema.parse(data);
}
