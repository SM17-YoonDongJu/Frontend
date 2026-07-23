"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { Spinner } from "@/shared/ui/icons/Spinner";
import { Button } from "@/shared/ui/Button";
import { useAdjusterApplication } from "../_api/use-adjuster-application";
import { clearVerificationDraft } from "../_model/verification-draft";
import {
  VerificationHeader,
  type BreadcrumbItem,
} from "../_components/VerificationHeader";
import { ApprovedNotice } from "./_components/ApprovedNotice";
import { RejectResult } from "./_components/RejectResult";
import { ReviewTimeline } from "./_components/ReviewTimeline";

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

function StatusShell({
  breadcrumb,
  children,
}: {
  breadcrumb: BreadcrumbItem[];
  children: ReactNode;
}) {
  return (
    <div className="md:fixed md:inset-0 md:overflow-y-auto md:bg-paper">
      <div className="hidden md:block">
        <VerificationHeader breadcrumb={breadcrumb} />
      </div>
      <div className="mx-auto flex min-h-dvh w-full max-w-[34rem] flex-col justify-center px-2 py-10 md:min-h-[calc(100dvh-4rem)] md:py-16">
        {children}
      </div>
    </div>
  );
}

function StatusContent() {
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

export default function AdjusterVerificationStatusPage() {
  return <StatusContent />;
}
