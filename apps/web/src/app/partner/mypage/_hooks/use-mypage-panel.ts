"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

/** URL로 열 수 있는 마이페이지 패널. 알림 팝오버의 "알림 설정" 진입에 사용. */
const panelSchema = z.enum(["notifications"]);
export type MypagePanel = z.infer<typeof panelSchema>;

export function useMypagePanel() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const panel = panelSchema.safeParse(params.get("panel")).data ?? null;

  const clearPanel = () => {
    const query = new URLSearchParams(params);
    query.delete("panel");
    const search = query.toString();
    router.replace(search ? `${pathname}?${search}` : pathname);
  };

  return { panel, clearPanel };
}
