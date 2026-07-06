"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";

// 사고 유형 필터 값은 명세 영문 enum + 전체.
const typeSchema = z.enum(["전체", ...accidentTypeSchema.options]);

export function useReviewFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const type = typeSchema.safeParse(params.get("type")).data ?? "전체";

  const setType = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "전체") next.delete("type");
    else next.set("type", value);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return { type, setType };
}
