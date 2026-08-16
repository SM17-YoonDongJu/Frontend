"use client";

import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { CREDENTIAL_PROOF } from "../_model/credential-proof.fixture";
import { CredentialInfoRow } from "./CredentialInfoRow";

interface CredentialProofModalProps {
  open: boolean;
  registrationNo: string;
  onClose: () => void;
}

/** 인증·자격 증빙 모달(Figma 146-4831) — 정적 표시 전용. */
export function CredentialProofModal({ open, registrationNo, onClose }: CredentialProofModalProps) {
  return (
    <Modal open={open} kicker="내 정보" title="인증 · 자격 증빙" onClose={onClose}>
      <div className="flex items-start gap-2.5 rounded-card bg-green-soft px-3.5 py-3">
        <ShieldCheck className="mt-0.5 shrink-0 text-[1rem] text-green" />
        <div>
          <p className="text-[0.875rem] font-semibold text-ink">자격 인증 완료</p>
          <p className="mt-0.5 text-[0.75rem] text-ink-2">
            {CREDENTIAL_PROOF.certifiedAt} 검증 · 인증 배지가 프로필에 표시돼요
          </p>
        </div>
      </div>

      <dl className="mt-4 divide-y divide-line-2">
        <CredentialInfoRow label="등록번호" value={registrationNo} />
        <CredentialInfoRow label="자격 구분" value={CREDENTIAL_PROOF.speciality} />
        {CREDENTIAL_PROOF.documents.map((doc) => (
          <CredentialInfoRow
            key={doc.label}
            label={doc.label}
            value={`${doc.fileName} · ${doc.fileSize}`}
            action
          />
        ))}
      </dl>

      <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-3">
        등록번호·자격 구분이 바뀌었다면 증빙을 다시 제출해주세요. 재심사 동안 기존 인증은
        유지돼요.
      </p>

      <div className="mt-5 flex justify-end">
        <Button size="sm" variant="outline" onClick={onClose}>
          닫기
        </Button>
      </div>
    </Modal>
  );
}
