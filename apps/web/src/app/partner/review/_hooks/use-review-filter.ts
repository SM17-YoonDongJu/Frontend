"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";

export type ReviewCategory = "pending" | "specialtyMatch" | "dueSoon";

const reviewCategorySchema = z.enum(["pending", "specialtyMatch", "dueSoon"]);
// 사고 유형 필터 값은 명세 영문 enum + 전체.
const typeSchema = z.enum(["전체", ...accidentTypeSchema.options]);

export function useReviewFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const active = reviewCategorySchema.safeParse(params.get("cat")).data ?? null;
  const type = typeSchema.safeParse(params.get("type")).data ?? "전체";
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
