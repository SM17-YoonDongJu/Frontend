"use client";

import { FileUploadField, type FileUploadStatus } from "@/shared/ui/FileUploadField";
import type { DocumentUpload } from "../_hooks/use-document-upload";
import type { VerificationForm } from "../_hooks/use-verification-form";

interface DocumentFieldsProps {
  form: VerificationForm;
}

// 업로드 실패 에러 우선, 없으면 제출 검증(필수 누락·자격증 배타) 에러를 표면화.
function resolveFieldState(
  doc: DocumentUpload,
  ruleError: string | undefined,
): { status: FileUploadStatus; errorMessage?: string } {
  const hasRuleError = doc.status !== "error" && Boolean(ruleError);
  return {
    status: hasRuleError ? "error" : doc.status,
    errorMessage: doc.errorMessage ?? ruleError,
  };
}

/** 증빙 서류 업로드(자격증 사본·등록증·신분증) + 안내 배너. */
export function DocumentFields({ form }: DocumentFieldsProps) {
  const { license, registration, idCard } = form.documents;

  const licenseState = resolveFieldState(license, form.errors.license);
  const registrationState = resolveFieldState(registration, form.errors.registration);
  const idCardState = resolveFieldState(idCard, form.errors.idCard);

  return (
    <div className="flex flex-col gap-3">
      <FileUploadField
        label="자격증 사본"
        description="신체손해사정사 자격증 (PDF/이미지)"
        status={licenseState.status}
        fileName={license.fileName}
        errorMessage={licenseState.errorMessage}
        onSelectFile={license.select}
      />
      <FileUploadField
        label="등록증"
        description="금융감독원 손해사정사 등록 확인서"
        status={registrationState.status}
        fileName={registration.fileName}
        errorMessage={registrationState.errorMessage}
        onSelectFile={registration.select}
      />
      <FileUploadField
        label="신분증"
        description="주민번호 뒷자리는 자동으로 가려집니다"
        status={idCardState.status}
        fileName={idCard.fileName}
        errorMessage={idCardState.errorMessage}
        onSelectFile={idCard.select}
      />
    </div>
  );
}
