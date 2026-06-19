"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ReviewCategory = "pending" | "specialtyMatch" | "dueSoon";

export function useReviewFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const active = params.get("cat") as ReviewCategory | null;
  const type = params.get("type") ?? "전체";
  const region = params.get("region") ?? "전체";

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null || value === "전체") next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return {
    active,
    type,
    region,
    setActive: (cat: ReviewCategory) => update("cat", active === cat ? null : cat),
    setType: (value: string) => update("type", value),
    setRegion: (value: string) => update("region", value),
  };
}
