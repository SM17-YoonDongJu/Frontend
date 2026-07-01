import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { proposalListSchema } from "../model/proposal.schema";
import type { ProposalList } from "../model/proposal.schema";

export function getProposalList(
  reportId: string,
  page = 1,
  size = 10,
): Promise<ProposalList> {
  const query = new URLSearchParams({ page: String(page), size: String(size) });
  return fetchJson(
    `${API_BASE_URL}/reports/${reportId}/proposals?${query.toString()}`,
    proposalListSchema,
  );
}
