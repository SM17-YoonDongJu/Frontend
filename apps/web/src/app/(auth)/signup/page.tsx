"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { UserType } from "@/shared/model/user";
import { getRegisterErrorCode, useRegister } from "./_api/use-register";
import { AdjusterNotice } from "./_components/AdjusterNotice";
import { CompleteStep } from "./_components/CompleteStep";
import { ConsentStep } from "./_components/ConsentStep";
import { RoleSelectStep } from "./_components/RoleSelectStep";
import { SignupProgress } from "./_components/SignupProgress";
import { useSignupFunnel } from "./_hooks/use-signup-funnel";
import { useSignupSocial } from "./_hooks/use-signup-social";
import { type ConsentState } from "./_model/consent-config";
import { toRegisterBody, type RegisterResponse } from "./_model/register.schema";
import { clearSignupDraft, loadSignupDraft, saveSignupDraft } from "./_model/signup-draft";
import type { TermsType } from "./_shared/model/terms";

const CUSTOMER_DASHBOARD_PATH = "/customer/dashboard";
const ADJUSTER_CERTIFY_PATH = "/signup/verification";

function SignupFunnel() {
  const router = useRouter();
  const funnel = useSignupFunnel();
  const social = useSignupSocial();
  const register = useRegister();

  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(
    () => loadSignupDraft().userType,
  );
  const [consent, setConsent] = useState<ConsentState>(() => loadSignupDraft().consent);
  const [showAdjusterNotice, setShowAdjusterNotice] = useState(false);
  const [result, setResult] = useState<RegisterResponse | null>(null);

  // 약관 상세 페이지 왕복 시 선택 역할·동의 상태 유지(전체 페이지 이동 대비).
  useEffect(() => {
    saveSignupDraft({ userType: selectedUserType, consent });
  }, [selectedUserType, consent]);

  // 직접 URL 진입 가드: 선행 단계 미완이면 첫 단계로 되돌림.
  useEffect(() => {
    if (funnel.step === "terms" && selectedUserType !== "insured_person") {
      funnel.goTo("role", { replace: true });
    }
    if (funnel.step === "done" && !result) {
      funnel.goTo("role", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnel.step]);

  const handleStart = () => {
    if (selectedUserType === "insured_person") {
      funnel.goTo("terms");
      return;
    }
    if (selectedUserType === "adjuster") setShowAdjusterNotice(true);
  };

  const handleToggle = (type: TermsType, checked: boolean) => {
    setConsent((prev) => ({ ...prev, [type]: checked }));
  };

  const handleToggleAll = (checked: boolean) => {
    setConsent({ service: checked, privacy: checked, marketing: checked });
  };

  const handleSubmit = () => {
    if (selectedUserType !== "insured_person") return;

    const body = toRegisterBody({
      provider: social.provider,
      socialToken: social.socialToken,
      userType: selectedUserType,
      nickname: social.nickname,
      email: social.email,
    });

    register.mutate(body, {
      onSuccess: (data) => {
        // TODO: accessToken/refreshToken 저장은 auth 토큰 저장 유틸 확정 후 연결.
        clearSignupDraft();
        setResult(data);
        funnel.goTo("done", { replace: true });
      },
    });
  };

  return (
    <div className="flex min-h-dvh w-full flex-col pb-8 pt-6 sm:pt-10">
      {funnel.step !== "done" && (
        <SignupProgress
          current={funnel.stepNumber}
          total={funnel.total}
          onBack={funnel.step === "terms" ? () => funnel.goTo("role") : undefined}
        />
      )}

      <div className="mt-6 flex flex-1 flex-col justify-center">
        <div className="rounded-card-lg border border-line bg-card p-6 sm:p-8">
        {funnel.step === "role" && (
          <RoleSelectStep
            selected={selectedUserType}
            onSelect={setSelectedUserType}
            onStart={handleStart}
          />
        )}

        {funnel.step === "terms" && (
          <ConsentStep
            consent={consent}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            onSubmit={handleSubmit}
            loading={register.isPending}
            errorCode={getRegisterErrorCode(register.error)}
          />
        )}

        {funnel.step === "done" && result && (
          <CompleteStep
            nickname={result.nickname}
            email={social.email}
            onStartAnalysis={() => router.push(CUSTOMER_DASHBOARD_PATH)}
          />
        )}
        </div>
      </div>

      {showAdjusterNotice && (
        <AdjusterNotice
          onClose={() => setShowAdjusterNotice(false)}
          onProceed={() => router.push(ADJUSTER_CERTIFY_PATH)}
        />
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupFunnel />
    </Suspense>
  );
}
