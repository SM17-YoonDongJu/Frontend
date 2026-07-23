export type ProblemIconName =
  | "fileText"
  | "alertTriangle"
  | "scale"
  | "trendingUp"
  | "messageCircle";

export interface ProblemItem {
  iconName: ProblemIconName;
  title: string;
  body: string;
}

export const PROBLEM_ITEMS: readonly ProblemItem[] = [
  {
    iconName: "fileText",
    title: "적용 가능한 특약 누락",
    body: "가입 특약 중 청구 가능한 항목을 놓치는 경우"
  },
  {
    iconName: "alertTriangle",
    title: "후유장해 인정 범위",
    body: "장해분류표상 인정 범위를 스스로 판단하기 어려움"
  },
  {
    iconName: "scale",
    title: "과실비율 차이",
    body: "교통사고 책임 비율에 따라 보상이 달라짐"
  },
  {
    iconName: "trendingUp",
    title: "유사 사례 대비 낮은 보상",
    body: "비슷한 사건과 비교할 기준이 없음"
  },
  {
    iconName: "messageCircle",
    title: "소액 사건 상담 포기",
    body: "손해사정 비용 부담으로 상담 자체를 포기"
  }
];

export interface ValueItem {
  title: string;
  body: string;
}

export const VALUE_ITEMS: readonly ValueItem[] = [
  {
    title: "AI 분석 리포트",
    body: "약관·특약·판례를 분석해 사건 요약, 적용 가능 특약, 주요 쟁점, 참고 가능한 예상 보상 범위를 정리합니다."
  },
  {
    title: "손해사정사 검수·매칭",
    body: "손해사정사가 검수해 등록한 리포트를 비교하고, 원하는 사정사에게 상담을 요청할 수 있습니다."
  }
];

export interface TrustItem {
  title: string;
  body: string;
}

export const TRUST_ITEMS: readonly TrustItem[] = [
  {
    title: "손해사정사",
    body: "등록번호·전문분야를 갖춘 손해사정사가 검수합니다."
  },
  {
    title: "개인정보 비식별",
    body: "사정사에게는 의뢰인 정보가 가명 처리(비식별)되어 전달됩니다."
  },
  {
    title: "검수 후 공개·전자서명",
    body: "리포트는 사정사 검수와 전자서명을 거쳐 등록되며, 등록 후에는 변경되지 않습니다."
  },
  {
    title: "매칭 전 수수료 없음",
    body: "손해사정사와 매칭되기 전까지 비용이 발생하지 않습니다."
  }
];
