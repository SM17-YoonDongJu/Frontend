import { z } from "zod";

/**
 * 서류 슬롯 단일 진실. 명명된 슬롯은 순수 FE/UX 구성 —
 * 제출 계약(POST /reports)의 documentUrls는 이 순서대로 평면화한 string[]이다.
 */
export const DOCUMENT_SLOT_KEYS = [
  "diagnosis",
  "insurancePolicy",
  "payoutResult",
  "admissionCert",
  "medicalReceipt",
] as const;

export const documentSlotKeySchema = z.enum(DOCUMENT_SLOT_KEYS);

/** 슬롯에 채워진 업로드 결과. 자동저장 복원용(File은 복원 불가 → url·파일명만). */
export const documentSlotValueSchema = z.object({
  url: z.url(),
  fileName: z.string(),
});

/** 슬롯 키 → 업로드 결과. 부분 입력 허용(partialRecord). */
export const documentSlotsSchema = z.partialRecord(documentSlotKeySchema, documentSlotValueSchema);

export type DocumentSlotKey = z.infer<typeof documentSlotKeySchema>;
export type DocumentSlotValue = z.infer<typeof documentSlotValueSchema>;
export type DocumentSlots = z.infer<typeof documentSlotsSchema>;

export interface DocumentSlotDef {
  key: DocumentSlotKey;
  label: string;
  required: boolean;
  hint?: string;
}

/** 슬롯 정의(라벨·필수여부·부제). 배열 순서 = documentUrls 평면화 순서. */
export const DOCUMENT_SLOTS: DocumentSlotDef[] = [
  { key: "diagnosis", label: "진단서", required: true },
  { key: "insurancePolicy", label: "보험증권", required: true },
  { key: "payoutResult", label: "보험금 지급결과서", required: false, hint: "이미 보험금을 받았다면 첨부" },
  { key: "admissionCert", label: "입원 확인서", required: false, hint: "입원 기간 확인용" },
  { key: "medicalReceipt", label: "진료비 영수증", required: false, hint: "치료비 산정용" },
];

export const REQUIRED_DOCUMENT_SLOTS = DOCUMENT_SLOTS.filter((s) => s.required);
