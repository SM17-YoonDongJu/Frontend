"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ReviewCategory = "pending" | "specialtyMatch" | "dueSoon";

export function useReviewFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get("cat") as ReviewCategory | null;

  const setActive = (cat: ReviewCategory) => {
    const next = new URLSearchParams(params);
    if (active === cat) next.delete("cat");
    else next.set("cat", cat);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return { active, setActive };
}
