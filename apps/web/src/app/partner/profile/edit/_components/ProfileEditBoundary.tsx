"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { ProfileEditSkeleton } from "./ProfileEditSkeleton";
import { ProfileEditView } from "./ProfileEditView";

const ERROR_MESSAGES = {
  FORBIDDEN: { title: "접근 권한이 없어요", desc: "손해사정사만 프로필을 수정할 수 있어요." },
};

export function ProfileEditBoundary() {
  return (
    <AsyncBoundary
      fallback={<ProfileEditSkeleton />}
      errorLayout="page"
      errorTitle="프로필을 불러오지 못했어요"
      errorMessages={ERROR_MESSAGES}
    >
      <ProfileEditView />
    </AsyncBoundary>
  );
}
