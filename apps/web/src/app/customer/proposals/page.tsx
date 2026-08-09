import { redirect } from "next/navigation";

/** 받은 제안 목록은 내 리포트 목록과 같은 데이터를 보여줘 통합됨(이슈 #262). 기존 진입 경로는 유지. */
export default function ReceivedProposalsPage() {
  redirect("/customer/reports");
}
