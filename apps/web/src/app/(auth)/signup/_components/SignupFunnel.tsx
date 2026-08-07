"use client";

import Link from "next/link";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { AuthHeader } from "../../_shared/ui/AuthHeader";
import { useSignupForm } from "../_hooks/use-signup-form";
import { AdjusterNotice } from "./AdjusterNotice";
import { CompleteStep } from "./CompleteStep";
import { ConsentStep } from "./ConsentStep";
import { IdentityStep } from "./IdentityStep";
import { RoleSelectStep } from "./RoleSelectStep";
import { SignupProgress } from "./SignupProgress";

export function SignupFunnel() {
  const { state, derived, actions } = useSignupForm();

  if (!derived.ready) return null;

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
      {derived.showProgress && (
        <div className="md:hidden">
          <SignupProgress current={derived.stepNumber} total={derived.total} onBack={actions.goBack} />
        </div>
      )}

      <div className="mt-6 flex flex-1 flex-col justify-center md:mt-0">
        <div className="rounded-card-lg border border-line bg-card p-6 sm:p-8 md:p-9 md:shadow-modal">
        {derived.canGoBack && (
          <button
            type="button"
            onClick={actions.goBack}
            aria-label="이전 단계로"
            className="-ml-2 mb-4 hidden size-9 items-center justify-center rounded-chip text-ink transition hover:bg-paper md:flex"
          >
            <ChevronRight className="rotate-180 text-[1.25rem]" />
          </button>
        )}

        {derived.step === "role" && (
          <RoleSelectStep
            selected={state.selectedUserType}
            onSelect={actions.selectUserType}
            onStart={actions.start}
          />
        )}

        {derived.step === "terms" && (
          <ConsentStep
            consent={state.consent}
            onToggle={actions.toggleConsent}
            onToggleAll={actions.toggleAllConsent}
            onNext={actions.goToIdentity}
          />
        )}

        {derived.step === "identity" && (
          <IdentityStep
            identity={state.identity}
            onChange={actions.changeIdentity}
            onSubmit={actions.submit}
            loading={derived.registerPending}
            errorCode={derived.registerErrorCode}
          />
        )}

        {derived.step === "done" && state.result && (
          <CompleteStep
            nickname={state.result.nickname}
            onStartAnalysis={actions.startAnalysis}
          />
        )}
        </div>
      </div>
      </div>

      {state.showAdjusterNotice && (
        <AdjusterNotice
          onClose={actions.closeAdjusterNotice}
          onProceed={actions.proceedAdjusterNotice}
        />
      )}
    </div>
  );
}
