import { z } from "zod";

/**
 * 서류 슬롯 단일 진실. 명명된 슬롯은 순수 FE/UX 구성 —
 * 제출 계약(POST /reports)의 documents[]는 이 순서대로 평면화한다.
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

/** 슬롯 정의(라벨·필수여부·부제). 배열 순서 = documents[] 평면화 순서. */
export const DOCUMENT_SLOTS: DocumentSlotDef[] = [
  { key: "diagnosis", label: "진단서", required: true },
  { key: "insurancePolicy", label: "보험증권", required: true },
  { key: "payoutResult", label: "보험금 지급결과서", required: false, hint: "이미 보험금을 받았다면 첨부" },
  { key: "admissionCert", label: "입원 확인서", required: false, hint: "입원 기간 확인용" },
  { key: "medicalReceipt", label: "진료비 영수증", required: false, hint: "치료비 산정용" },
];

export const REQUIRED_DOCUMENT_SLOTS = DOCUMENT_SLOTS.filter((s) => s.required);

/** POST /reports body의 documents[] 항목(명세 s3_url/name/report_type/file_type의 camel형). */
export interface DocumentPayload {
  s3Url: string;
  name: string;
  reportType: string;
  fileType: string;
}

/** 슬롯 외 업로드(기타 서류)의 report_type. */
const EXTRA_REPORT_TYPE = "기타";

function fileNameFromUrl(url: string): string {
  try {
    const base = new URL(url).pathname.split("/").filter(Boolean).pop();
    return base ? decodeURIComponent(base) : "첨부 파일";
  } catch {
    return "첨부 파일";
  }
}

/** 파일 확장자(소문자, 점 제외) → file_type. 확장자 없으면 빈 문자열. */
function fileTypeOf(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx > 0 ? name.slice(idx + 1).toLowerCase() : "";
}

/**
 * 슬롯(파일명·유형 보유) + 기타 url을 명세 documents[] 구조로 평면화.
 * 슬롯: report_type=슬롯 라벨, name=업로드 파일명. 기타: url에서 파일명 추출, report_type="기타".
 */
export function flattenDocuments(
  slots: DocumentSlots | undefined,
  documentUrls: string[],
): DocumentPayload[] {
  const items: DocumentPayload[] = [];
  const slotUrls = new Set<string>();

  for (const def of DOCUMENT_SLOTS) {
    const value = slots?.[def.key];
    if (!value?.url) continue;
    slotUrls.add(value.url);
    const name = value.fileName || fileNameFromUrl(value.url);
    items.push({ s3Url: value.url, name, reportType: def.label, fileType: fileTypeOf(name) });
  }

  for (const url of documentUrls) {
    if (slotUrls.has(url)) continue;
    const name = fileNameFromUrl(url);
    items.push({ s3Url: url, name, reportType: EXTRA_REPORT_TYPE, fileType: fileTypeOf(name) });
  }

  return items;
}
