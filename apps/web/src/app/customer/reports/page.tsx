import type { Metadata } from "next";
import { CustomerReportsBoundary } from "./_components/CustomerReportsBoundary";

export const metadata: Metadata = {
  title: "검수 내역",
};

export default function CustomerReportsPage() {
  return <CustomerReportsBoundary />;
}
