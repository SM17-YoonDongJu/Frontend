"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/shared/ui/Button";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { Spinner } from "@/shared/ui/icons/Spinner";
import { useAdjusterApplication } from "../../_api/use-adjuster-application";
import { clearVerificationDraft } from "../../_model/verification-draft";
import type { BreadcrumbItem } from "../../_components/VerificationHeader";
import { ApprovedNotice } from "./ApprovedNotice";
import { RejectResult } from "./RejectResult";
import { ReviewTimeline } from "./ReviewTimeline";
import { StatusShell } from "./StatusShell";

const FORM_PATH = "/signup/verification";
const DASHBOARD_PATH = "/customer/dashboard";
const PARTNER_PATH = "/partner";

const REVIEW_CRUMB: BreadcrumbItem[] = [
  { label: "가입", state: "done" },
  { label: "자격 인증", state: "done" },
  { label: "심사", state: "active" },
];

const REJECT_CRUMB: BreadcrumbItem[] = [
  { label: "가입", state: "done" },
  { label: "자격 인증 반려", state: "active" },
];

export function StatusContent() {
  const router = useRouter();
  const { data, isPending, isError, refetch } = useAdjusterApplication();

  // 404(신청 이력 없음 → data null) → 폼으로 유도.
  useEffect(() => {
    if (!isPending && !isError && data === null) router.replace(FORM_PATH);
  }, [isPending, isError, data, router]);

  // N6: 승인 확정 시 로컬 draft 정리(마지막 제출값 더 이상 불필요).
  useEffect(() => {
    if (data?.status === "APPROVED") clearVerificationDraft();
  }, [data?.status]);

  if (isPending) {
    return (
      <StatusShell breadcrumb={REVIEW_CRUMB}>
        <div className="flex flex-col items-center gap-3 py-16 text-ink-3">
          <Spinner />
          <p className="text-sm">심사 현황을 불러오는 중이에요.</p>
        </div>
      </StatusShell>
    );
  }

  if (isError) {
    return (
      <StatusShell breadcrumb={REVIEW_CRUMB}>
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-terra-soft text-[1.5rem] text-terra">
            <AlertTriangle />
          </span>
          <p className="break-keep text-sm text-ink-2">
            심사 현황을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      </StatusShell>
    );
  }

  if (data === null) return null; // 폼으로 이동 중

  if (data.status === "REJECTED") {
    return (
      <StatusShell breadcrumb={REJECT_CRUMB}>
        <RejectResult application={data} onResubmit={() => router.push(FORM_PATH)} />
      </StatusShell>
    );
  }

  if (data.status === "APPROVED") {
    return (
      <StatusShell breadcrumb={REVIEW_CRUMB}>
        <ApprovedNotice
          application={data}
          onEnterPartner={() => router.push(PARTNER_PATH)}
          onHome={() => router.push(DASHBOARD_PATH)}
        />
      </StatusShell>
    );
  }

  return (
    <StatusShell breadcrumb={REVIEW_CRUMB}>
      <ReviewTimeline application={data} onHome={() => router.push(DASHBOARD_PATH)} />
    </StatusShell>
  );
}
