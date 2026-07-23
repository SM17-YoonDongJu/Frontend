"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { UserType } from "@/shared/model/user";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { AuthHeader } from "../_shared/ui/AuthHeader";
import { getRegisterErrorCode, useRegister } from "./_api/use-register";
import { AdjusterNotice } from "./_components/AdjusterNotice";
import { CompleteStep } from "./_components/CompleteStep";
import { ConsentStep } from "./_components/ConsentStep";
import { IdentityStep } from "./_components/IdentityStep";
import { RoleSelectStep } from "./_components/RoleSelectStep";
import { SignupProgress } from "./_components/SignupProgress";
import { useSignupFunnel, type SignupStep } from "./_hooks/use-signup-funnel";
import { useSignupSocial } from "./_hooks/use-signup-social";
import { isRequiredConsentMet, type ConsentState } from "./_model/consent-config";
import { toRegisterBody, type RegisterResponse } from "./_model/register.schema";
import { clearSignupTicket } from "../_shared/lib/signup-ticket";
import {
  clearSignupDraft,
  loadSignupDraft,
  saveSignupDraft,
  type IdentityDraft,
} from "./_model/signup-draft";
import type { TermsType } from "./_shared/model/terms";

const CUSTOMER_DASHBOARD_PATH = "/customer/dashboard";
const ADJUSTER_CERTIFY_PATH = "/signup/verification";

/** 뒤로가기 대상 단계. 첫 단계·완료는 없음. */
const BACK_TARGET: Partial<Record<SignupStep, SignupStep>> = {
  terms: "role",
  identity: "terms",
};

function SignupFunnel() {
  const router = useRouter();
  const funnel = useSignupFunnel();
  const social = useSignupSocial();
  const register = useRegister();

  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(
    () => loadSignupDraft().userType,
  );
  const [consent, setConsent] = useState<ConsentState>(() => loadSignupDraft().consent);
  const [identity, setIdentity] = useState<IdentityDraft>(() => loadSignupDraft().identity);
  const [showAdjusterNotice, setShowAdjusterNotice] = useState(false);
  const [result, setResult] = useState<RegisterResponse | null>(null);

  // 약관 상세 페이지 왕복 시 선택 역할·동의·본인 확인 입력 유지(전체 페이지 이동 대비).
  useEffect(() => {
    saveSignupDraft({ userType: selectedUserType, consent, identity });
  }, [selectedUserType, consent, identity]);

  // 소셜 인증 컨텍스트(티켓·쿼리) 없이 직접 진입하면 로그인으로 되돌림.
  useEffect(() => {
    if (!social) router.replace("/login");
  }, [social, router]);

  // 직접 URL 진입 가드: 선행 단계 미완이면 첫 단계로 되돌림.
  useEffect(() => {
    if (funnel.step === "terms" && selectedUserType !== "insured_person") {
      funnel.goTo("role", { replace: true });
    }
    if (
      funnel.step === "identity" &&
      (selectedUserType !== "insured_person" || !isRequiredConsentMet(consent))
    ) {
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
    if (selectedUserType !== "insured_person" || !social || !identity.gender) return;

    const body = toRegisterBody({
      provider: social.provider,
      socialToken: social.socialToken,
      userType: selectedUserType,
      nickname: social.nickname,
      gender: identity.gender,
      birthDate: identity.birthDate,
      phoneNumber: identity.phoneNumber,
    });

    register.mutate(body, {
      onSuccess: (data) => {
        clearSignupDraft();
        clearSignupTicket();
        setResult(data);
        funnel.goTo("done", { replace: true });
      },
    });
  };

  if (!social) return null;

  const backTarget = BACK_TARGET[funnel.step];
  const goBack = backTarget ? () => funnel.goTo(backTarget) : undefined;

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <AuthHeader
        className="hidden md:flex"
        right={
          <span className="flex items-center gap-2.5 text-[0.8125rem]">
            <span className="font-medium text-ink-3">이미 계정이 있으신가요?</span>
            <Link
              href="/login"
              className="rounded-button border border-line px-[0.9375rem] py-[0.5625rem] font-semibold text-ink transition hover:bg-paper"
            >
              로그인
            </Link>
          </span>
        }
      />

      <div className="mx-auto flex w-full flex-1 flex-col pb-8 pt-6 sm:pt-10 md:max-w-[35rem] md:px-5 md:pb-16 md:pt-12">
      {funnel.step !== "done" && (
        <div className="md:hidden">
          <SignupProgress current={funnel.stepNumber} total={funnel.total} onBack={goBack} />
        </div>
      )}

      <div className="mt-6 flex flex-1 flex-col justify-center md:mt-0">
        <div className="rounded-card-lg border border-line bg-card p-6 sm:p-8 md:p-9 md:shadow-modal">
        {goBack && (
          <button
            type="button"
            onClick={goBack}
            aria-label="이전 단계로"
            className="-ml-2 mb-4 hidden size-9 items-center justify-center rounded-chip text-ink transition hover:bg-paper md:flex"
          >
            <ChevronRight className="rotate-180 text-[1.25rem]" />
          </button>
        )}

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
            onNext={() => funnel.goTo("identity")}
          />
        )}

        {funnel.step === "identity" && (
          <IdentityStep
            identity={identity}
            onChange={setIdentity}
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
