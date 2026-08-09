export const APP_NAME = "바른보상";
export const DEVELOPER_NAME = "바른보상 팀";
export const DELETION_REQUEST_EMAIL = "teambrbosang@gmail.com";

export interface AccountDeletionSection {
  heading: string;
  body?: string;
  items?: readonly string[];
  ordered?: boolean;
}

export const ACCOUNT_DELETION_SECTIONS: readonly AccountDeletionSection[] = [
  {
    heading: "서비스 정보",
    items: [
      `앱 이름: ${APP_NAME}`,
      `개발자: ${DEVELOPER_NAME}`,
      `문의 이메일: ${DELETION_REQUEST_EMAIL}`
    ]
  },
  {
    heading: "계정 삭제 요청 방법",
    ordered: true,
    items: [
      `${APP_NAME} 앱 또는 웹에서 로그인합니다.`,
      "마이페이지로 이동합니다.",
      "회원 탈퇴를 선택한 뒤 안내에 따라 탈퇴를 완료합니다."
    ],
    body: "탈퇴가 완료되면 계정과 관련 데이터가 삭제됩니다."
  },
  {
    heading: "삭제되는 데이터",
    items: [
      "계정 정보(소셜 로그인 식별자, 닉네임, 성별, 생년월일, 휴대전화번호, 프로필 이미지, 활동 지역)",
      "받은 제안과 상담 내역",
      "주고받은 채팅 대화",
      "요청한 검토 리포트 이력",
      "신청 과정에서 업로드한 첨부 파일",
      "알림 발송에 사용한 기기 푸시 토큰"
    ]
  },
  {
    heading: "보관되는 데이터와 보관 기간",
    body: "회원 탈퇴 시 위 데이터를 지체 없이 파기하며 별도로 보관하지 않습니다. 다만 손해사정사 회원이 제출한 자격증 사본 등 자격 검증 정보는 분쟁 대응을 위해 탈퇴 후 1년간 별도 보관한 뒤 파기하고, 관계 법령에 따라 보존이 필요한 항목이 있는 경우 해당 법령이 정한 기간 동안 보관합니다."
  },
  {
    heading: "삭제 후 복구",
    body: "삭제된 정보는 복구할 수 없으며, 같은 계정으로 다시 가입해도 이전 내역은 되살아나지 않습니다."
  }
];
