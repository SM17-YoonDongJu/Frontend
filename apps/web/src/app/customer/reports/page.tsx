import type { Metadata } from "next";
import { ReportListBoundary } from "./_components/ReportListBoundary";

export const metadata: Metadata = {
  title: "내 리포트",
};

export default function ReportListPage() {
  return <ReportListBoundary />;
}
