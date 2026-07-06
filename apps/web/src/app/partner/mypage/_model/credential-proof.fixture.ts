/** 증빙 모달 정적 데이터 — UI 전용(이슈 #46 범위: 동작 없음).
 * 실연동 시 GET /users/adjuster-applications/me의 documents[]로 대체(ERD 확장 보류 건). */
export const CREDENTIAL_PROOF = {
  certifiedAt: "2026.01.15",
  speciality: "신체손해사정사",
  documents: [
    { label: "자격증 사본", fileName: "자격증.pdf", fileSize: "2.1MB" },
    { label: "등록확인서", fileName: "금감원 등록확인서.pdf", fileSize: "0.8MB" },
  ],
} as const;
