import type { Metadata } from "next";
import { ReviewHistoryBoundary } from "./_components/ReviewHistoryBoundary";

export const metadata: Metadata = {
  title: "검수 내역",
};

export default function ReviewHistoryPage() {
  return <ReviewHistoryBoundary />;
}
