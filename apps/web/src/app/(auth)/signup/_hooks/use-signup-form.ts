"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TermsType } from "@/shared/model/terms-content";
import type { UserType } from "@/shared/model/user";
import { clearSignupTicket } from "../../_shared/lib/signup-ticket";
import { getRegisterErrorCode, useRegister } from "../_api/use-register";
import { isRequiredConsentMet, type ConsentState } from "../_model/consent-config";
import { toRegisterBody, type RegisterResponse } from "../_model/register.schema";
import {
  clearSignupDraft,
  loadSignupDraft,
  saveSignupDraft,
  type IdentityDraft,
} from "../_model/signup-draft";
import { useSignupFunnel, type SignupStep } from "./use-signup-funnel";
import { useSignupSocial } from "./use-signup-social";

const CUSTOMER_DASHBOARD_PATH = "/customer/dashboard";
const ADJUSTER_CERTIFY_PATH = "/signup/verification";

/** 뒤로가기 대상 단계. 첫 단계·완료는 없음. */
const BACK_TARGET: Partial<Record<SignupStep, SignupStep>> = {
  terms: "role",
  identity: "terms",
};

export function useSignupForm() {
  const router = useRouter();
  const funnel = useSignupFunnel();
  const social = useSignupSocial();
  const register = useRegister();

  const [draft] = useState(loadSignupDraft);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(draft.userType);
  const [consent, setConsent] = useState<ConsentState>(draft.consent);
  const [identity, setIdentity] = useState<IdentityDraft>(draft.identity);
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

  const start = useCallback(() => {
    if (selectedUserType === "insured_person") {
      funnel.goTo("terms");
      return;
    }
    if (selectedUserType === "adjuster") setShowAdjusterNotice(true);
  }, [selectedUserType, funnel]);

  const toggleConsent = useCallback((type: TermsType, checked: boolean) => {
    setConsent((prev) => ({ ...prev, [type]: checked }));
  }, []);

  const toggleAllConsent = useCallback((checked: boolean) => {
    setConsent({ service: checked, privacy: checked, marketing: checked });
  }, []);

  const { mutate: submitRegister } = register;
  const submit = useCallback(() => {
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

    submitRegister(body, {
      onSuccess: (data) => {
        clearSignupDraft();
        clearSignupTicket();
        setResult(data);
        funnel.goTo("done", { replace: true });
      },
    });
  }, [selectedUserType, social, identity, submitRegister, funnel]);

  const backTarget = BACK_TARGET[funnel.step];

  const derived = useMemo(
    () => ({
      ready: social !== null,
      step: funnel.step,
      stepNumber: funnel.stepNumber,
      total: funnel.total,
      showProgress: funnel.step !== "done",
      canGoBack: backTarget !== undefined,
      registerPending: register.isPending,
      registerErrorCode: getRegisterErrorCode(register.error),
      email: social?.email,
    }),
    [social, funnel.step, funnel.stepNumber, funnel.total, backTarget, register.isPending, register.error],
  );

  const actions = useMemo(
    () => ({
      selectUserType: setSelectedUserType,
      start,
      toggleConsent,
      toggleAllConsent,
      goToIdentity: () => funnel.goTo("identity"),
      changeIdentity: setIdentity,
      submit,
      goBack: backTarget ? () => funnel.goTo(backTarget) : undefined,
      closeAdjusterNotice: () => setShowAdjusterNotice(false),
      proceedAdjusterNotice: () => router.push(ADJUSTER_CERTIFY_PATH),
      startAnalysis: () => router.push(CUSTOMER_DASHBOARD_PATH),
    }),
    [start, toggleConsent, toggleAllConsent, submit, backTarget, funnel, router],
  );

  return {
    state: { selectedUserType, consent, identity, showAdjusterNotice, result },
    derived,
    actions,
  };
}
