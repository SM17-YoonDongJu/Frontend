"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { proposalKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getProposalList } from "./get-proposal-list";

export function useProposalList(reportId: string, page?: number, size?: number) {
  return useSuspenseQuery({
    queryKey: proposalKeys.list(reportId).queryKey,
    queryFn: () => getProposalList(reportId, page, size),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}
