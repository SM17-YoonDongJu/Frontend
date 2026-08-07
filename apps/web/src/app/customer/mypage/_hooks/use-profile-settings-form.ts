"use client";

import { useEffect, useRef, useState } from "react";
import { useUpdateMe } from "@/shared/api/use-update-me";
import { uploadErrorMessage } from "@/shared/api/upload-file";
import { useUploadFile } from "@/shared/api/use-upload-file";
import { validateUploadFile } from "@/shared/model/upload.schema";
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
  const [phone, setPhone] = useState(profile.phoneNumber ?? "");
  // UI는 단일 지역 선택 — 명세 region은 배열이라 첫 항목만 편집하고 저장 시 배열로 감싼다.
  const [region, setRegion] = useState(profile.region[0] ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatarUrl);
  const objectUrlRef = useRef<string | null>(null);

  const { mutate: updateMe, isPending: isSaving } = useUpdateMe();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile("avatar");

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const pickFile = async (file: File) => {
    const invalid = validateUploadFile(file, "avatar");
    if (invalid) {
      toast.error(invalid);
      return;
    }

    const previousAvatarUrl = avatarUrl;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setAvatarUrl(objectUrl);

    try {
      const { url } = await uploadFile(file);
      setAvatarUrl(url);
    } catch (error) {
      setAvatarUrl(previousAvatarUrl);
      toast.error(uploadErrorMessage(error));
    } finally {
      URL.revokeObjectURL(objectUrl);
      if (objectUrlRef.current === objectUrl) objectUrlRef.current = null;
    }
  };

  const save = () => {
    updateMe(
      {
        phoneNumber: phone,
        region: region ? [region] : [],
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
