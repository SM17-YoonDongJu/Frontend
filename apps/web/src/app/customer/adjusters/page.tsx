import type { Metadata } from "next";
import { AdjusterListBoundary } from "./_components/AdjusterListBoundary";

export const metadata: Metadata = {
  title: "손해사정사 찾기",
  description: "금융감독원 등록 자격과 신원이 검증된 독립 손해사정사를 사건에 맞게 연결합니다.",
};

export default function AdjusterListPage() {
  return <AdjusterListBoundary />;
}
