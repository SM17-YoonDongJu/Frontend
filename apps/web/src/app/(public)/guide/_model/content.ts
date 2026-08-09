export type FlowIconName = "upload" | "fileText" | "checkCircle" | "messageCircle";

export interface FlowStep {
  no: string;
  iconName: FlowIconName;
  title: string;
  body: string;
}

export const FLOW_STEPS: readonly FlowStep[] = [
  {
    no: "01",
    iconName: "upload",
    title: "분석 신청",
    body: "실손·교통사고·후유장해 등 보험 유형을 고르고, 약관·진단서 등 서류를 올린 뒤 사고·청구 내용을 입력합니다."
  },
  {
    no: "02",
    iconName: "fileText",
    title: "AI 분석 + 전문가 검수",
    body: "AI가 약관·특약·판례로 초안을 만들고, 손해사정사가 검수해 리포트로 등록합니다."
  },
  {
    no: "03",
    iconName: "checkCircle",
    title: "리포트 확인",
    body: "적용 가능 특약, 주요 쟁점, 참고 가능한 예상 보상 범위를 리포트에서 확인합니다."
  },
  {
    no: "04",
    iconName: "messageCircle",
    title: "상담·매칭",
    body: "검수 리포트를 비교하고 원하는 손해사정사에게 상담을 요청합니다."
  }
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "비용이 드나요?",
    answer: "참고용 분석은 무료이며, 손해사정사와 매칭되기 전까지 비용이 발생하지 않습니다."
  },
  {
    question: "AI가 알아서 판단하나요?",
    answer: "AI 분석 초안을 손해사정사가 검수한 뒤 리포트가 공개됩니다."
  },
  {
    question: "제 개인정보는 안전한가요?",
    answer: "손해사정사에게는 의뢰인 정보가 가명 처리(비식별)되어 전달됩니다."
  },
  {
    question: "보험금을 더 받을 수 있나요?",
    answer:
      "바른보상의 분석은 참고용 추정이며 결과를 보장하지 않습니다. 예상 보상 범위와 쟁점을 정리해 판단을 돕습니다."
  },
  {
    question: "어떤 보험을 다루나요?",
    answer: "실손, 교통사고, 후유장해 등 여러 유형을 지원합니다."
  }
];
