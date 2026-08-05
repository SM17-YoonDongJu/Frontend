import "@/shared/api/client";
import { getMyPage } from "@/shared/api/generated/sdk.gen";
import { mypageSchema } from "../_model/mypage.schema";
import type { Mypage } from "../_model/types";

export async function getMypage(): Promise<Mypage> {
  const { data } = await getMyPage({ throwOnError: true });
  return mypageSchema.parse(data);
}
