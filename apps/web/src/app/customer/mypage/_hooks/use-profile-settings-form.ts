"use client";

import { useState } from "react";
import { useUpdateMe } from "@/shared/api/use-update-me";
import { useUploadFile } from "@/shared/api/use-upload-file";
import { toast } from "@/shared/ui/toast";
import type { Me } from "../_model/types";

interface UseProfileSettingsFormParams {
  profile: Me;
  onSaved: () => void;
}

/**
 * 프로필 설정 폼 로컬 상태(모달/시트 공유).
 * 휴대폰·지역·아바타 draft 관리 + 사진 업로드(→URL) + 저장(PATCH /users/me) 오케스트레이션.
 */
export function useProfileSettingsForm({
  profile,
  onSaved,
}: UseProfileSettingsFormParams) {
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [region, setRegion] = useState(profile.region ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatarUrl);

  const { mutate: updateMe, isPending: isSaving } = useUpdateMe();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

  const pickFile = async (file: File) => {
    const { url } = await uploadFile(file);
    setAvatarUrl(url);
  };

  const save = () => {
    updateMe(
      {
        phone,
        region,
        ...(avatarUrl && avatarUrl !== profile.avatarUrl
          ? { avatarUrl }
          : {}),
      },
      {
        onSuccess: onSaved,
        onError: () =>
          toast.error("프로필 저장에 실패했어요. 잠시 후 다시 시도해 주세요."),
      },
    );
  };

  return {
    phone,
    setPhone,
    region,
    setRegion,
    avatarUrl,
    pickFile,
    isUploading,
    isSaving,
    save,
  };
}
