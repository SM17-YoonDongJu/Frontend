"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

/** UI에 노출하는 필터 값(전체=null). API status enum 중 이 화면이 선택 가능한 2개만. */
const selectableStatusSchema = z.enum(["COUNSELING", "CLOSED"]);
export type SelectableReportStatus = z.infer<typeof selectableStatusSchema>;

export function useReportHistoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const status = selectableStatusSchema.safeParse(params.get("status")).data ?? null;

  const setStatus = (next: SelectableReportStatus | null) => {
    const query = new URLSearchParams(params);
    if (next === null) query.delete("status");
    else query.set("status", next);
    const search = query.toString();
    router.replace(search ? `${pathname}?${search}` : pathname);
  };

  return { status, setStatus };
}
