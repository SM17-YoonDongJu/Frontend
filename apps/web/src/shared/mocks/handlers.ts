import { delay, http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/shared/api/config";

// 로드 시점 기준 상대 마감일(로컬 달력 날짜) — 대시보드 "오늘 마감/N일 남음" 검증용
function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// 손해사정사 프로필 목 데이터 — 진입 adjusterId를 그대로 반영해 응답.
// 빈 후기·404 검증용 고정 id 분기.
const ADJUSTER_EMPTY_REVIEWS_ID = "00000000-0000-4000-8000-000000000000";
const ADJUSTER_NOT_FOUND_ID = "99999999-9999-4999-8999-999999999999";
// 클릭스루 샘플 리포트의 담당 사정사 — 고정값이라야 리뷰 등록분이 프로필에 반영되고 중복 등록 409가 동작.
const CUSTOMER_SAMPLE_ADJUSTER_ID = "11111111-1111-4111-8111-111111111111";

// 손해사정사 목록 목 데이터 (이슈 #47) — GET /adjusters. verified 전부 true, avatarUrl null 섞음.
// 상위 6명은 Figma 카드 그대로, 나머지 20명은 페이지네이션(더보기) 확인용 생성분(총 26명 = 20 + 6, 2페이지).
const EXTRA_ADJUSTER_NAMES = [
  "김하늘", "박서준", "이도현", "최지우", "정다은",
  "한지민", "오세훈", "서예린", "임태양", "황보라",
  "신우재", "문가영", "배성호", "노유진", "권민혁",
  "송이레", "양지원", "구본우", "차수아", "홍재이",
] as const;

const EXTRA_SPECIALTIES = ["후유장해", "교통사고", "실손 의료비", "암·진단비", "배상책임", "산재 연계"] as const;
const EXTRA_REGIONS = ["서울", "경기", "인천", "대구 · 경북", "광주 · 전남"] as const;

// 결정적 생성(랜덤 없음) — E2E가 개수·정렬을 단언할 수 있게 경력≤16(정우성 18 최고), 평점≤4.8(정우성 4.9 최고) 유지.
const EXTRA_ADJUSTER_MOCK = EXTRA_ADJUSTER_NAMES.map((name, i) => {
  const specialty: string = EXTRA_SPECIALTIES[i % EXTRA_SPECIALTIES.length] ?? "후유장해";
  const region: string = EXTRA_REGIONS[i % EXTRA_REGIONS.length] ?? "서울";
  return {
    adjusterId: `77777777-0000-4000-8000-${String(i).padStart(12, "0")}`,
    name: `${name} 사정사`,
    avatarUrl: null,
    verified: true,
    specialties: [specialty],
    headline: `${specialty} 청구 근거 정리 전문`,
    averageRating: Math.round((4.3 + (i % 6) * 0.1) * 10) / 10,
    reviewCount: 30 + i * 5,
    career: 5 + (i % 12),
    completedConsultCount: 60 + i * 7,
    activityRegion: region,
  };
});

const ADJUSTER_LIST_MOCK = [
  {
    adjusterId: "11111111-1111-4111-8111-111111111111",
    name: "정우성 사정사",
    avatarUrl: null,
    verified: true,
    specialties: ["후유장해", "교통사고"],
    headline: "18년 경력, 고액 분쟁사건 해결 다수",
    averageRating: 4.9,
    reviewCount: 214,
    career: 18,
    completedConsultCount: 410,
    activityRegion: "서울 · 경기",
  },
  {
    adjusterId: "22222222-2222-4222-8222-222222222222",
    name: "이서연 사정사",
    avatarUrl: "https://picsum.photos/seed/adjuster-2/160",
    verified: true,
    specialties: ["실손 의료비", "암·진단비"],
    headline: "실손·진단비 부지급 뒤집은 협상 전문",
    averageRating: 4.8,
    reviewCount: 176,
    career: 12,
    completedConsultCount: 320,
    activityRegion: "서울",
  },
  {
    adjusterId: "33333333-3333-4333-8333-333333333333",
    name: "윤지후 사정사",
    avatarUrl: null,
    verified: true,
    specialties: ["산재 연계", "후유장해"],
    headline: "산재·자보 동시 청구 근거 설계",
    averageRating: 4.7,
    reviewCount: 132,
    career: 15,
    completedConsultCount: 268,
    activityRegion: "인천 · 경기",
  },
  {
    adjusterId: "44444444-4444-4444-8444-444444444444",
    name: "박준호 사정사",
    avatarUrl: "https://picsum.photos/seed/adjuster-4/160",
    verified: true,
    specialties: ["배상책임", "교통사고"],
    headline: "10년 경력, 대인·대물 배상 산정 밀착",
    averageRating: 4.6,
    reviewCount: 98,
    career: 9,
    completedConsultCount: 152,
    activityRegion: "경기",
  },
  {
    adjusterId: "55555555-5555-4555-8555-555555555555",
    name: "최민서 사정사",
    avatarUrl: null,
    verified: true,
    specialties: ["암·진단비", "실손 의료비"],
    headline: "진단비 특약 해석·약관 분쟁 전담",
    averageRating: 4.8,
    reviewCount: 145,
    career: 11,
    completedConsultCount: 205,
    activityRegion: "부산 · 경남",
  },
  {
    adjusterId: "66666666-6666-4666-8666-666666666666",
    name: "한도윤 사정사",
    avatarUrl: null,
    verified: true,
    specialties: ["후유장해", "산재 연계", "배상책임"],
    headline: "6년 경력, 장해등급 재산정 근거 중심",
    averageRating: 4.7,
    reviewCount: 87,
    career: 6,
    completedConsultCount: 95,
    activityRegion: "대전 · 충청",
  },
  ...EXTRA_ADJUSTER_MOCK,
];

interface SubmittedReview {
  nickname: string;
  score: number;
  item: string;
  reviewedAt: string;
  content: string;
}

// 등록된 후기 저장소 (이슈 #76) — adjusterId별 누적. 목 로그인 유저당 1회 제한(중복 등록 409).
const submittedReviews = new Map<string, SubmittedReview[]>();

function maskNickname(nickname: string): string {
  const chars = Array.from(nickname);
  if (chars.length <= 1) return nickname;
  return `${chars[0]}${"*".repeat(chars.length - 1)}`;
}

function buildAdjusterProfile(adjusterId: string, withReviews: boolean) {
  const baseCount = withReviews ? 86 : 0;
  const baseAverage = withReviews ? 4.9 : 0;
  const submitted = submittedReviews.get(adjusterId) ?? [];

  const reviewCount = baseCount + submitted.length;
  const scoreSum = baseAverage * baseCount + submitted.reduce((s, r) => s + r.score, 0);
  const averageRating =
    reviewCount === 0 ? 0 : Math.round((scoreSum / reviewCount) * 10) / 10;

  return {
    adjusterId,
    nickname: "김도현",
    avatarUrl: null,
    headline: "장해등급 재산정 전문 · 근거 중심 검토",
    activityRegion: "서울 · 경기",
    introduction:
      "후유장해 등급 산정과 교통사고 보상을 12년간 다뤄온 독립 손해사정사입니다. 진단 검사 결과를 장해분류표에 정확히 매핑하고, 약관·특약·판례를 근거로 적정 보상 범위를 제시합니다. 의뢰인이 이해할 수 있도록 모든 판단의 근거를 함께 설명드립니다.",
    specialties: ["후유장해", "교통사고", "장해등급 재산정"],
    careers: [
      { period: "2018 – 현재", company: "독립 손해사정 법인 · 대표 사정사" },
      { period: "2014 – 2018", company: "대형 손해보험사 보상 심사팀" },
      { period: "2013", company: "손해사정사 자격 취득 (제0000호)" },
    ],
    career: 12,
    averageRating,
    reviewCount,
    recentReviews: [
      ...submitted.map((r) => ({
        nickname: r.nickname,
        score: r.score,
        item: r.item,
        reviewedAt: r.reviewedAt,
        content: r.content,
      })),
      ...(withReviews
        ? [
          {
            nickname: "윤O서",
            score: 5,
            item: "교통사고 · 후유장해",
            reviewedAt: "2026-05-12T00:00:00Z",
            content:
              "장해등급 재산정으로 처음 제안보다 크게 증액됐어요. 근거를 약관·판례로 짚어주셔서 믿음이 갔습니다.",
          },
          {
            nickname: "이O준",
            score: 5,
            item: "실손 의료비",
            reviewedAt: "2026-04-03T00:00:00Z",
            content:
              "복잡한 특약 누락을 찾아주셨고 진행 상황을 매번 설명해 주셨습니다.",
          },
        ]
        : []),
    ],
    completedConsultCount: 240,
    handledCaseCount: 510,
    verified: true,
    consultGuide: {
      method: "비대면 · 방문",
      initialConsult: "무료 (리포트 기반)",
      feeBasis: "성공보수 협의",
    },
    certification: {
      registrationNo: "제0000호",
      verifiedAt: "2026-01-01T00:00:00Z",
    },
  };
}

// 검수 대기 목 데이터 — reportId 안정 위해 모듈 스코프에 고정.
// CONTRACT: 명세없음-임시 — caseId·title·region·claimedMin/Max·offerHeadroom은 list 미확장 필드(MSW 목킹).
const PENDING_REVIEWS = [
  { reportId: crypto.randomUUID(), accidentType: "disability", status: "AWAITING_INSPECTION", createdAt: `${addDays(new Date(), 0)}T09:00:00Z`, caseId: "042", title: "우측 슬관절 인대 파열 · 등급 재산정", region: "서울 강남", claimedMinAmount: 12_000_000, claimedMaxAmount: 18_000_000, offerHeadroom: 5_500_000, issueCount: 2, held: false },
  { reportId: crypto.randomUUID(), accidentType: "traffic", status: "AWAITING_INSPECTION", createdAt: `${addDays(new Date(), -1)}T08:10:00Z`, caseId: "041", title: "다발성 늑골 골절 · 일실수입 과소", region: "경기 성남", claimedMinAmount: 24_000_000, claimedMaxAmount: 31_000_000, offerHeadroom: 6_000_000, issueCount: 3, held: false },
  { reportId: crypto.randomUUID(), accidentType: "disability", status: "AWAITING_INSPECTION", createdAt: "2026-06-18T16:40:00Z", caseId: "038", title: "요추 추간판탈출 · 특약 누락", region: "서울 송파", claimedMinAmount: 9_000_000, claimedMaxAmount: 14_000_000, offerHeadroom: 2_800_000, issueCount: 2, held: false },
  { reportId: crypto.randomUUID(), accidentType: "medical_indemnity", status: "AWAITING_INSPECTION", createdAt: "2026-06-18T11:20:00Z", caseId: "036", title: "비급여 도수치료 · 한도 분쟁", region: "인천 연수", claimedMinAmount: 3_200_000, claimedMaxAmount: 4_800_000, offerHeadroom: 1_600_000, issueCount: 1, held: false },
  { reportId: crypto.randomUUID(), accidentType: "traffic", status: "AWAITING_ADOPTION", createdAt: "2026-06-17T14:05:00Z", caseId: "034", title: "경추 염좌 · 향후 치료비 미반영", region: "서울 마포", claimedMinAmount: 6_000_000, claimedMaxAmount: 9_000_000, offerHeadroom: 2_100_000, issueCount: 1, held: false },
  { reportId: crypto.randomUUID(), accidentType: "disability", status: "AWAITING_ADOPTION", createdAt: "2026-06-16T10:30:00Z", caseId: "033", title: "견관절 회전근개 파열 · 등급 재산정", region: "경기 수원", claimedMinAmount: 11_000_000, claimedMaxAmount: 15_500_000, offerHeadroom: 4_200_000, issueCount: 2, held: false },
  { reportId: crypto.randomUUID(), accidentType: "cancer_diagnosis", status: "COUNSELING", createdAt: "2026-06-15T09:15:00Z", caseId: "031", title: "유사암 분류 쟁점 · 진단비 과소", region: "서울 종로", claimedMinAmount: 20_000_000, claimedMaxAmount: 20_000_000, offerHeadroom: 3_000_000, issueCount: 2, held: false },
  { reportId: crypto.randomUUID(), accidentType: "medical_indemnity", status: "COUNSELING", createdAt: "2026-06-14T13:50:00Z", caseId: "029", title: "통원 한도 적용 분쟁", region: "부산 해운대", claimedMinAmount: 2_800_000, claimedMaxAmount: 3_600_000, offerHeadroom: 900_000, issueCount: 1, held: false },
  { reportId: crypto.randomUUID(), accidentType: "traffic", status: "NOT_SELECTED", createdAt: "2026-06-13T08:40:00Z", caseId: "027", title: "다발성 늑골 골절 · 일실수입", region: "대구 수성", claimedMinAmount: 18_000_000, claimedMaxAmount: 24_000_000, offerHeadroom: 5_000_000, issueCount: 1, held: false },
  { reportId: crypto.randomUUID(), accidentType: "fire", status: "CLOSED", createdAt: "2026-06-12T15:20:00Z", caseId: "024", title: "가재도구 손해액 산정", region: "광주 서구", claimedMinAmount: 8_500_000, claimedMaxAmount: 12_000_000, offerHeadroom: 1_800_000, issueCount: 1, held: false },
];

// 검수 내역 목 데이터 (이슈 #59) — GET /adjusters/me/reviewed-reports.
// 명세 6필드(caseId·title·sentDate·status·statusLabel·hasOpinion) + ⚠️명세없음-1 4필드
// (accidentType·confirmedMin/MaxAmount·rating: FE optional, 백엔드 list 확장 대기)를 채움.
const REVIEWED_REPORTS = [
  { caseId: "20260605-021", title: "후유장해 · 십자인대 파열 등급 재산정", sentDate: "2026-06-05", status: "CONSULTATION", statusLabel: "상담 전환", hasOpinion: true, accidentType: "disability", confirmedMinAmount: 14_000_000, confirmedMaxAmount: 17_500_000, rating: 4.9 },
  { caseId: "20260603-018", title: "교통사고 · 일실수입 과소 산정", sentDate: "2026-06-03", status: "CLOSED", statusLabel: "종결", hasOpinion: true, accidentType: "traffic", confirmedMinAmount: 24_000_000, confirmedMaxAmount: 30_000_000, rating: 5.0 },
  { caseId: "20260530-014", title: "실손 의료비 · 비급여 도수치료 한도 분쟁", sentDate: "2026-05-30", status: "SENT", statusLabel: "전송 완료", hasOpinion: false, accidentType: "medical_indemnity", confirmedMinAmount: 3_200_000, confirmedMaxAmount: 4_800_000, rating: null },
  { caseId: "20260528-009", title: "후유장해 · 요추 추간판탈출 특약 누락", sentDate: "2026-05-28", status: "CONSULTATION", statusLabel: "상담 전환", hasOpinion: true, accidentType: "disability", confirmedMinAmount: 9_000_000, confirmedMaxAmount: 14_000_000, rating: 4.7 },
  { caseId: "20260525-006", title: "암·진단비 · 유사암 분류 쟁점", sentDate: "2026-05-25", status: "CLOSED", statusLabel: "종결", hasOpinion: true, accidentType: "cancer_diagnosis", confirmedMinAmount: 20_000_000, confirmedMaxAmount: 20_000_000, rating: 4.8 },
  { caseId: "20260522-003", title: "교통사고 · 경추 염좌 향후 치료비 미반영", sentDate: "2026-05-22", status: "NOT_SELECTED", statusLabel: "미선정", hasOpinion: false, accidentType: "traffic", confirmedMinAmount: 6_000_000, confirmedMaxAmount: 9_000_000, rating: null },
  { caseId: "20260520-017", title: "후유장해 · 견관절 회전근개 파열", sentDate: "2026-05-20", status: "CONSULTATION", statusLabel: "상담 전환", hasOpinion: true, accidentType: "disability", confirmedMinAmount: 11_000_000, confirmedMaxAmount: 15_500_000, rating: 4.9 },
  { caseId: "20260518-011", title: "화재 · 가재도구 손해액 산정", sentDate: "2026-05-18", status: "CLOSED", statusLabel: "종결", hasOpinion: true, accidentType: "fire", confirmedMinAmount: 8_500_000, confirmedMaxAmount: 12_000_000, rating: 4.6 },
  { caseId: "20260515-008", title: "배상책임 · 대인 사고 위자료 쟁점", sentDate: "2026-05-15", status: "SENT", statusLabel: "전송 완료", hasOpinion: false, accidentType: "liability", confirmedMinAmount: 5_000_000, confirmedMaxAmount: 7_000_000, rating: null },
  { caseId: "20260512-004", title: "실손 의료비 · 통원 한도 적용", sentDate: "2026-05-12", status: "CONSULTATION", statusLabel: "상담 전환", hasOpinion: true, accidentType: "medical_indemnity", confirmedMinAmount: 2_800_000, confirmedMaxAmount: 3_600_000, rating: 4.5 },
  { caseId: "20260509-002", title: "후유장해 · 안면부 외모추상 장해", sentDate: "2026-05-09", status: "CLOSED", statusLabel: "종결", hasOpinion: true, accidentType: "disability", confirmedMinAmount: 16_000_000, confirmedMaxAmount: 22_000_000, rating: 5.0 },
  { caseId: "20260506-015", title: "교통사고 · 다발성 늑골 골절", sentDate: "2026-05-06", status: "NOT_SELECTED", statusLabel: "미선정", hasOpinion: false, accidentType: "traffic", confirmedMinAmount: 18_000_000, confirmedMaxAmount: 24_000_000, rating: null },
  { caseId: "20260503-010", title: "암·진단비 · 재진단암 인정 범위", sentDate: "2026-05-03", status: "CONSULTATION", statusLabel: "상담 전환", hasOpinion: true, accidentType: "cancer_diagnosis", confirmedMinAmount: 30_000_000, confirmedMaxAmount: 30_000_000, rating: 4.8 },
  { caseId: "20260430-005", title: "실손 의료비 · 비급여 주사료 분쟁", sentDate: "2026-04-30", status: "CLOSED", statusLabel: "종결", hasOpinion: true, accidentType: "medical_indemnity", confirmedMinAmount: 1_400_000, confirmedMaxAmount: 1_750_000, rating: 4.4 },
] as const;

// 알림 목록 목 데이터 (이슈 #49) — ⚠️ 명세없음-초안(.pr-assets/api-spec-draft-notifications.md).
// createdAt은 달력 기준(오늘/어제 고정) → 조회 시각과 무관하게 오늘·어제·이전 세 그룹이 항상 나온다.
// read-all 호출 시 isRead를 모듈 상태로 전부 true 반영.
// 오늘 항목: 오늘 자정 기준 hoursBack 시간 전, 단 자정을 넘지 않게 클램프(새벽 조회 시에도 오늘 유지).
function todayAgo(hoursBack: number): string {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const target = Date.now() - hoursBack * 60 * 60 * 1000;
  return new Date(Math.max(target, startOfToday.getTime() + 60 * 1000)).toISOString();
}

function yesterdayAt(hour: number): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const NOTIFICATIONS = [
  { notificationId: "d0000000-0000-4000-8000-000000000001", type: "REVIEW_COMPLETE", title: "검수가 완료됐어요", body: "김도현 사정사님이 리포트를 검수했어요.", isRead: false, createdAt: todayAgo(2) },
  { notificationId: "d0000000-0000-4000-8000-000000000002", type: "RECEIVED_PROPOSAL", title: "새 제안 2건 도착", body: "교통사고 리포트에 상담 제안이 왔어요.", isRead: false, createdAt: todayAgo(5) },
  { notificationId: "d0000000-0000-4000-8000-000000000003", type: "CONSULT_ACCEPTED", title: "상담이 수락됐어요", body: "정우성 사정사님이 상담을 수락했어요.", isRead: true, createdAt: yesterdayAt(15) },
  { notificationId: "d0000000-0000-4000-8000-000000000004", type: "ANALYSIS_COMPLETE", title: "분석이 완료됐어요", body: "제출하신 서류 분석 리포트가 준비됐어요.", isRead: true, createdAt: yesterdayAt(11) },
  { notificationId: "d0000000-0000-4000-8000-000000000005", type: "IDENTITY_VERIFIED", title: "본인 인증 완료", body: "계정 본인 인증이 완료됐어요.", isRead: true, createdAt: "2026-05-18T09:00:00Z" },
];

// 거절된 제안(키: `${reportId}:${adjusterId}`) — 거절 후 목록에서 제외 재현.
const rejectedProposals = new Set<string>();

// 고객 대시보드 — 받은 제안이 연결된 리포트(①)의 안정 uuid.
export const DASHBOARD_PROPOSABLE_REPORT_ID =
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DASHBOARD_AWAITING_REPORT_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

// 본인 손해사정사 프로필 — PATCH가 머지로 갱신하는 모듈 스코프 가변 객체
// (프로필 편집 화면 + 대시보드 헤더·인사말 공용 — 집계 필드 포함 superset, 각 소비자 스키마가 잔여 필드 strip)
const ADJUSTER_PROFILE: Record<string, unknown> = {
  adjusterId: "11111111-1111-4111-8111-111111111111",
  nickname: "김상정",
  headline: "후유장해 전문 12년, 거절 사건을 다시 봅니다",
  introduction:
    "교통사고·후유장해 중심으로 장해등급 산정과 약관 해석을 다뤄왔습니다. 의뢰인이 받은 제안을 약관·특약·판례에 비춰 다시 검토하고, 누락된 청구 가능성을 근거와 함께 설명드립니다.",
  career: 12,
  activityRegion: "서울·경기",
  avatarUrl: null,
  specialties: ["후유장해", "교통사고"],
  careers: [
    { period: "2014.03 ~ 2019.02", company: "OO손해사정법인" },
    { period: "2019.03 ~ 현재", company: "독립 손해사정사" },
  ],
  registrationNo: "제0000호",
  updatedAt: "2026-06-20T08:00:00Z",
  // 대시보드 헤더·인사말용 집계(읽기 전용)
  averageRating: 4.9,
  reviewCount: 86,
  pendingReviewCount: 4,
};

// 알림 설정 (이슈 #46) — PATCH가 머지로 갱신하는 모듈 스코프 가변 객체
const NOTIFICATION_SETTINGS: Record<string, boolean> = {
  newReviewRequest: true,
  consultMessage: true,
  settlementNotice: false,
  reviewComplete: true,
  receivedProposal: true,
  marketing: false,
};

// 마이페이지 집계 (이슈 #46) — GET /adjusters/me/mypage, ADJUSTER_PROFILE 페르소나와 수치 일치
const ADJUSTER_MYPAGE = {
  profile: {
    nickname: "김상정",
    email: "kimsangjeong@example.com",
    avatarUrl: null,
    headline: "후유장해 전문 12년, 거절 사건을 다시 봅니다",
    specialties: ["후유장해", "교통사고"],
    career: 12,
    activityRegion: "서울·경기",
    role: "CERTIFICATED_ADJUSTER",
  },
  stats: {
    averageRating: 4.9,
    reviewCount: 86,
    totalCompletedCount: 240,
    consultationConversionRate: 62,
  },
  monthlyActivity: {
    completedCount: 14,
    consultationConvertedCount: 9,
    averageRating: 4.9,
  },
  certification: {
    licenseNo: "제2014-0087호",
    activityRegion: "서울·경기",
    createdAt: "2026-01-01T00:00:00Z",
  },
};

// ── 채팅(이슈 #48) 모듈 스코프 가변 상태 ─────────────────────────────
// senderId 정합: 내 메시지는 MOCK_ME_ID(= String(users/me.userId "1024")).
// 페이지가 넘기는 currentUserId도 String(me.userId)라 문자열 비교로 mine 판별.
// ⚠️ userId uuid 전환 백엔드 확인 요청 — 명세 senderId는 uuid, use-me.userId는 number.
const MOCK_ME_ID = "1024";

const CHAT_ADJUSTER_1_ID = "d1000000-0000-4000-8000-000000000001";
const CHAT_ADJUSTER_2_ID = "d1000000-0000-4000-8000-000000000002";
const CHAT_ADJUSTER_3_ID = "d1000000-0000-4000-8000-000000000003";

const CHAT_ROOM_1_ID = "e1000000-0000-4000-8000-000000000001";
const CHAT_ROOM_2_ID = "e1000000-0000-4000-8000-000000000002";
const CHAT_ROOM_3_ID = "e1000000-0000-4000-8000-000000000003";

// 각 방 = 각 제안(report_reviews.id). 매칭/거절 PATCH 대상.
const CHAT_PROPOSAL_1_ID = "c1000000-0000-4000-8000-000000000001";
const CHAT_PROPOSAL_2_ID = "c1000000-0000-4000-8000-000000000002";
const CHAT_PROPOSAL_3_ID = "c1000000-0000-4000-8000-000000000003";

type MockMatchStatus = "SENT" | "COUNSELING" | "REJECTED" | "ACCEPTED";

interface MockChatRoom {
  chatRoomId: string;
  lastMessage: string | null;
  updatedAt: string;
  adjusterId: string;
  adjusterName: string;
  avatarUrl: string | null;
  reportId: string;
  caseNo: string;
  roomStatus: "REQUESTED" | "ACTIVE" | "CLOSED";
  lastMessageAt: string;
  proposalId: string;
  matchStatus: MockMatchStatus;
  reportTypeLabel: string;
}

interface MockChatMessage {
  messageId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

// 비교 그룹 검증: 3방 모두 동일 reportId·caseNo, COUNSELING(비교중)으로 시작. adjusterName만 상이.
const chatRooms: MockChatRoom[] = [
  {
    chatRoomId: CHAT_ROOM_1_ID,
    lastMessage: "리포트 검토해봤습니다. 상담 가능하세요?",
    updatedAt: "2026-07-01T10:32:00Z",
    adjusterId: CHAT_ADJUSTER_1_ID,
    adjusterName: "김도현 손해사정사",
    avatarUrl: null,
    reportId: DASHBOARD_PROPOSABLE_REPORT_ID,
    caseNo: "#20260520-017",
    roomStatus: "ACTIVE",
    lastMessageAt: "2026-07-01T10:32:00Z",
    proposalId: CHAT_PROPOSAL_1_ID,
    matchStatus: "COUNSELING",
    reportTypeLabel: "후유장해",
  },
  {
    chatRoomId: CHAT_ROOM_2_ID,
    lastMessage: "외모추상 특약도 함께 보겠습니다.",
    updatedAt: "2026-06-30T15:10:00Z",
    adjusterId: CHAT_ADJUSTER_2_ID,
    adjusterName: "정우성 손해사정사",
    avatarUrl: null,
    reportId: DASHBOARD_PROPOSABLE_REPORT_ID,
    caseNo: "#20260520-017",
    roomStatus: "ACTIVE",
    lastMessageAt: "2026-06-30T15:10:00Z",
    proposalId: CHAT_PROPOSAL_2_ID,
    matchStatus: "COUNSELING",
    reportTypeLabel: "후유장해",
  },
  {
    chatRoomId: CHAT_ROOM_3_ID,
    lastMessage: "상담 도와드리겠습니다.",
    updatedAt: "2026-06-20T09:00:00Z",
    adjusterId: CHAT_ADJUSTER_3_ID,
    adjusterName: "윤지후 손해사정사",
    avatarUrl: null,
    reportId: DASHBOARD_PROPOSABLE_REPORT_ID,
    caseNo: "#20260520-017",
    roomStatus: "ACTIVE",
    lastMessageAt: "2026-06-20T09:00:00Z",
    proposalId: CHAT_PROPOSAL_3_ID,
    matchStatus: "COUNSELING",
    reportTypeLabel: "후유장해",
  },
];

// GET /reports/{id}/proposals ↔ 채팅방 정합용 제안 메타(디자인 확장 필드). 상태·식별자는 chatRooms가 원천.
const CHAT_PROPOSAL_META: Record<
  string,
  {
    rating: number;
    proposalSummary: string;
    submittedAt: string;
    speciality: string;
    career: number;
    isNew: boolean;
    isVerified: boolean;
    estimateMinAmount: number | null;
    estimateMaxAmount: number | null;
    feeBasis: string;
  }
> = {
  [CHAT_PROPOSAL_1_ID]: {
    rating: 4.8,
    proposalSummary:
      "장해등급 재산정으로 12급 적용 여지가 있어 보입니다. 상담 후 함께 판단해요.",
    submittedAt: "2026-05-22T10:14:00+09:00",
    speciality: "후유장해 전문",
    career: 12,
    isNew: true,
    isVerified: true,
    estimateMinAmount: 14_000_000,
    estimateMaxAmount: 17_500_000,
    feeBasis: "상담 시 서면 안내",
  },
  [CHAT_PROPOSAL_2_ID]: {
    rating: 4.6,
    proposalSummary: "외모추상 특약 누락 건까지 함께 청구를 검토할 수 있습니다.",
    submittedAt: "2026-05-21T16:40:00+09:00",
    speciality: "후유장해 전문",
    career: 18,
    isNew: true,
    isVerified: true,
    estimateMinAmount: 13_500_000,
    estimateMaxAmount: 17_000_000,
    feeBasis: "상담 시 서면 안내",
  },
  [CHAT_PROPOSAL_3_ID]: {
    rating: 4.9,
    proposalSummary: "과실 비율 재검토 여지가 있는지 리포트를 살펴보고 싶습니다.",
    submittedAt: "2026-05-20T09:05:00+09:00",
    speciality: "교통사고 전문",
    career: 8,
    isNew: false,
    isVerified: true,
    estimateMinAmount: null,
    estimateMaxAmount: null,
    feeBasis: "상담 시 서면 안내",
  },
};

// 김도현 방 과거 메시지 36건 — 커서 페이지네이션(이전 대화 불러오기) 검증용. 결정적 생성(랜덤 없음).
const CHAT_ROOM_1_OLDER: MockChatMessage[] = Array.from({ length: 36 }, (_, i) => {
  const mine = i % 2 === 1;
  const hour = String(9 + (i % 8)).padStart(2, "0");
  const day = String(24 + Math.floor(i / 12)).padStart(2, "0"); // 06-24 ~ 06-26
  return {
    messageId: `a1000000-0000-4000-8000-0000000001${String(i).padStart(2, "0")}`,
    senderId: mine ? MOCK_ME_ID : CHAT_ADJUSTER_1_ID,
    content: mine
      ? `이전 문의 내용 ${i + 1}번이에요.`
      : `이전 답변 내용 ${i + 1}번입니다.`,
    createdAt: `2026-06-${day}T${hour}:${String((i * 7) % 60).padStart(2, "0")}:00Z`,
  };
});

// 방별 메시지 히스토리(2일 이상 걸쳐 날짜 구분선 검증, mine/theirs 교차)
const chatMessages: Record<string, MockChatMessage[]> = {
  [CHAT_ROOM_1_ID]: [
    ...CHAT_ROOM_1_OLDER,
    { messageId: "a1000000-0000-4000-8000-000000000001", senderId: CHAT_ADJUSTER_1_ID, content: "안녕하세요, 김도현 손해사정사입니다. 리포트 잘 받았습니다.", createdAt: "2026-06-30T09:00:00Z" },
    { messageId: "a1000000-0000-4000-8000-000000000002", senderId: MOCK_ME_ID, content: "네, 안녕하세요. 검토 부탁드려요.", createdAt: "2026-06-30T09:05:00Z" },
    { messageId: "a1000000-0000-4000-8000-000000000003", senderId: CHAT_ADJUSTER_1_ID, content: "장해등급 재산정 여지가 있어 보입니다.", createdAt: "2026-06-30T09:12:00Z" },
    { messageId: "a1000000-0000-4000-8000-000000000004", senderId: MOCK_ME_ID, content: "그럼 어떻게 진행하면 될까요?", createdAt: "2026-07-01T10:20:00Z" },
    { messageId: "a1000000-0000-4000-8000-000000000005", senderId: CHAT_ADJUSTER_1_ID, content: "리포트 검토해봤습니다. 상담 가능하세요?", createdAt: "2026-07-01T10:32:00Z" },
  ],
  [CHAT_ROOM_2_ID]: [
    { messageId: "a2000000-0000-4000-8000-000000000001", senderId: MOCK_ME_ID, content: "외모추상 특약도 청구할 수 있나요?", createdAt: "2026-06-29T14:00:00Z" },
    { messageId: "a2000000-0000-4000-8000-000000000002", senderId: CHAT_ADJUSTER_2_ID, content: "외모추상 특약도 함께 보겠습니다.", createdAt: "2026-06-30T15:10:00Z" },
  ],
  [CHAT_ROOM_3_ID]: [
    { messageId: "a3000000-0000-4000-8000-000000000001", senderId: CHAT_ADJUSTER_3_ID, content: "상담 도와드리겠습니다.", createdAt: "2026-06-18T09:00:00Z" },
    { messageId: "a3000000-0000-4000-8000-000000000002", senderId: MOCK_ME_ID, content: "감사합니다.", createdAt: "2026-06-19T11:00:00Z" },
    { messageId: "a3000000-0000-4000-8000-000000000003", senderId: CHAT_ADJUSTER_3_ID, content: "상담이 종료되었습니다.", createdAt: "2026-06-20T09:00:00Z" },
  ],
};

export const handlers = [
  http.get("/api/ping", () => HttpResponse.json({ message: "pong (mocked)" })),

  // 채팅방 목록 (이슈 #48) — 정확 경로. :param 라우트보다 먼저 등록.
  http.get(`${API_BASE_URL}/chats`, async ({ request }) => {
    await delay(400);

    if (request.headers.get("x-mock-failure") === "chat-list") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "채팅 목록을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    // 빈 상태(대화 없음) 검증용 — E2E override
    const items =
      request.headers.get("x-mock-empty") === "chat-list" ? [] : chatRooms;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { items },
    });
  }),

  // 메시지 히스토리 (이슈 #48) — 커서 페이지네이션(?cursor&size, 기본 30).
  // 최신 size건을 시간순으로 반환, cursor는 "이 메시지보다 오래된 것" 기준. CLOSED 방도 조회 가능.
  http.get(`${API_BASE_URL}/chats/:chatRoomId/messages`, async ({ request, params }) => {
    await delay(400);

    const chatRoomId = String(params.chatRoomId);
    const all = chatMessages[chatRoomId] ?? [];

    const url = new URL(request.url);
    const size = Number(url.searchParams.get("size") ?? 30);
    const cursor = url.searchParams.get("cursor");

    let end = all.length;
    if (cursor) {
      const cursorIndex = all.findIndex((message) => message.messageId === cursor);
      if (cursorIndex !== -1) end = cursorIndex;
    }
    const start = Math.max(0, end - size);
    const list = all.slice(start, end);
    // 더 오래된 페이지가 남아 있으면 이번 페이지 첫 메시지를 다음 커서로
    const nextCursor = start > 0 ? (list[0]?.messageId ?? null) : null;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { list, nextCursor },
    });
  }),

  // 메시지 전송 (이슈 #48) — CLOSED 방은 409, 그 외 상태 배열 append + 방 갱신.
  http.post(`${API_BASE_URL}/chats/:chatRoomId/messages`, async ({ request, params }) => {
    await delay(300);

    const chatRoomId = String(params.chatRoomId);

    if (request.headers.get("x-mock-failure") === "chat-send") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "메시지를 전송하지 못했습니다." },
        { status: 500 },
      );
    }

    const room = chatRooms.find((r) => r.chatRoomId === chatRoomId);
    if (room?.roomStatus === "CLOSED") {
      // CONTRACT: CLOSED 명세 코드 — ⚠️ Notion 명세 409 근거·전역 enum 반영 요청.
      return HttpResponse.json(
        { status: "409", code: "CLOSED", message: "종료된 상담입니다." },
        { status: 409 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as { content?: string };
    const content = typeof body.content === "string" ? body.content : "";
    const createdAt = new Date().toISOString();
    const messageId = crypto.randomUUID();

    (chatMessages[chatRoomId] ??= []).push({
      messageId,
      senderId: MOCK_ME_ID,
      content,
      createdAt,
    });

    if (room) {
      room.lastMessage = content;
      room.lastMessageAt = createdAt;
      room.updatedAt = createdAt;
    }

    return HttpResponse.json(
      {
        status: "201",
        message: "전송되었습니다.",
        data: { messageId, chatRoomId, senderId: MOCK_ME_ID, content, createdAt },
      },
      { status: 201 },
    );
  }),

  // 상담 종료 (이슈 #48) — ACTIVE→CLOSED. 이미 CLOSED면 409 DUPLICATE_RESOURCE(Notion 채팅 종료 명세).
  http.patch(`${API_BASE_URL}/chats/:chatRoomId/close`, async ({ params }) => {
    await delay(300);

    const chatRoomId = String(params.chatRoomId);
    const room = chatRooms.find((r) => r.chatRoomId === chatRoomId);

    if (!room) {
      return HttpResponse.json(
        { status: "404", code: "POST_NOT_FOUND", message: "채팅방을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    if (room.roomStatus === "CLOSED") {
      return HttpResponse.json(
        { status: "409", code: "DUPLICATE_RESOURCE", message: "이미 종료된 상담입니다." },
        { status: 409 },
      );
    }

    room.roomStatus = "CLOSED";

    return HttpResponse.json({
      status: "200",
      message: "상담을 종료했습니다.",
      data: { chatRoomId, status: "CLOSED" },
    });
  }),

  // 알림 모두 읽음 처리 (#49) — ⚠️ 명세없음-초안. 구체 경로를 목록 GET보다 먼저 등록.
  http.patch(`${API_BASE_URL}/users/me/notifications/read-all`, async ({ request }) => {
    await delay(400);

    if (request.headers.get("x-mock-failure") === "read-all") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "읽음 처리에 실패했습니다." },
        { status: 500 },
      );
    }

    for (const notification of NOTIFICATIONS) notification.isRead = true;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: null,
    });
  }),

  // 내 알림 목록 (#49) — ⚠️ 명세없음-초안. read-all 반영된 isRead 상태 그대로 반환.
  http.get(`${API_BASE_URL}/users/me/notifications`, async ({ request }) => {
    await delay(400);

    if (request.headers.get("x-mock-failure") === "notifications") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "알림을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { list: NOTIFICATIONS },
    });
  }),

  // 회원가입 (#43) — 전역 봉투 거울. 성공 201 + data(토큰 포함).
  // 에러 재현: nickname "중복닉네임"→409 DUPLICATE_RESOURCE, 2자 미만→400 VALIDATION_ERROR,
  //   provider/socialToken/userType 누락→400 MISSING_REQUIRED_FIELD, x-mock-failure:social→500 EXTERNAL_API_ERROR.
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    await delay(600);

    const body = (await request.json().catch(() => ({}))) as {
      provider?: string;
      socialToken?: string;
      nickname?: string;
      userType?: string;
      email?: string;
    };

    if (request.headers.get("x-mock-failure") === "social") {
      return HttpResponse.json(
        { status: "500", code: "EXTERNAL_API_ERROR", message: "소셜 인증에 실패했습니다. 다시 시도해 주세요." },
        { status: 500 },
      );
    }

    if (!body.provider || !body.socialToken || !body.userType) {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "필수 입력값이 누락되었습니다." },
        { status: 400 },
      );
    }

    if (!body.nickname || body.nickname.length < 2 || body.nickname.length > 20) {
      return HttpResponse.json(
        { status: "400", code: "VALIDATION_ERROR", message: "닉네임은 2~20자로 입력해 주세요." },
        { status: 400 },
      );
    }

    if (body.nickname === "중복닉네임") {
      return HttpResponse.json(
        { status: "409", code: "DUPLICATE_RESOURCE", message: "이미 사용 중인 닉네임이에요." },
        { status: 409 },
      );
    }

    return HttpResponse.json(
      {
        status: "201",
        message: "회원가입이 완료되었습니다.",
        data: {
          userId: crypto.randomUUID(),
          nickname: body.nickname,
          // 응답 역할은 명세대로 role(요청 userType 매핑: adjuster→UNCERTIFICATED_ADJUSTER, 그 외→USER)
          role: body.userType === "adjuster" ? "UNCERTIFICATED_ADJUSTER" : "USER",
          accessToken: `mock-access-${crypto.randomUUID()}`,
          refreshToken: `mock-refresh-${crypto.randomUUID()}`,
        },
      },
      { status: 201 },
    );
  }),

  // 본인 프로필 조회 (이슈 #31 프로필 편집 + 대시보드 헤더 공용). :adjusterId 라우트보다 먼저 등록
  http.get(`${API_BASE_URL}/adjusters/me/profile`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "profile") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "프로필을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "조회 성공",
      data: ADJUSTER_PROFILE,
    });
  }),

  // 손해사정사 대시보드 요약·활동통계 (#30) — ⚠️ API 명세 미정(드리프트), MSW 선구현
  http.get(`${API_BASE_URL}/adjusters/me/dashboard`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "dashboard") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "대시보드를 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        summary: {
          pendingCount: 4,
          pendingNewCount: 2,
          inProgressCount: 2,
          monthlyCompletedCount: 14,
          totalCompletedCount: 240,
          averageRating: 4.9,
          reviewCount: 86,
        },
        activity: {
          completedCount: 14,
          consultationConvertedCount: 9,
          averageRating: 4.9,
        },
      },
    });
  }),

  // 손해사정사 마이페이지 집계 (이슈 #46)
  http.get(`${API_BASE_URL}/adjusters/me/mypage`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "mypage") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "마이페이지를 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: ADJUSTER_MYPAGE,
    });
  }),

  // 알림 설정 조회 (이슈 #46)
  http.get(`${API_BASE_URL}/users/me/notification-settings`, async ({ request }) => {
    await delay(300);

    if (request.headers.get("x-mock-failure") === "notification-settings") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "알림 설정을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { ...NOTIFICATION_SETTINGS },
    });
  }),

  // 알림 설정 저장 (이슈 #46) — 수정한 항목만 머지, 전체 설정 반환
  http.patch(`${API_BASE_URL}/users/me/notification-settings`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "notification-settings") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "알림 설정을 저장하지 못했습니다." },
        { status: 500 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return HttpResponse.json(
        { status: "400", code: "INVALID_REQUEST", message: "입력 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    for (const key of Object.keys(NOTIFICATION_SETTINGS)) {
      if (typeof body[key] === "boolean") {
        NOTIFICATION_SETTINGS[key] = body[key];
      }
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { ...NOTIFICATION_SETTINGS },
    });
  }),

  // 진행 중 사건 (#30) — ⚠️ API 명세 미정(드리프트), MSW 선구현
  http.get(`${API_BASE_URL}/adjusters/me/in-progress`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "in-progress") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "진행 중 사건을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        list: [
          {
            reportId: "c1000000-0000-4000-8000-000000000022",
            accidentType: "후유장해",
            caseId: "20260528-022",
            description: "장해등급 재산정 의견 작성 중",
            status: "REVIEWING",
            progress: 65,
          },
          {
            reportId: "c1000000-0000-4000-8000-000000000019",
            accidentType: "교통사고",
            caseId: "20260527-019",
            description: "검수 완료 · 고객 상담 대기",
            status: "CUSTOMER_REVIEW",
            progress: 100,
          },
        ],
      },
    });
  }),

  // 본인 정보 조회 (고객 대시보드 인사말)
  // E2E 역할 게이팅 검증용: localStorage["mock:userType"]="adjuster"면 사정사로 응답(기본 insured_person).
  http.get(`${API_BASE_URL}/users/me`, async ({ request }) => {
    await delay(300);
    // 비로그인 시나리오 주입 — E2E 랜딩(온보딩) 검증용. 기본은 로그인 유저(변경 없음).
    if (request.headers.get("x-mock-scenario") === "unauthenticated") {
      return HttpResponse.json(
        { status: "401", code: "LOGIN_REQUIRED", message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }
    const override =
      typeof localStorage !== "undefined" ? localStorage.getItem("mock:userType") : null;
    const userType = override === "adjuster" ? "adjuster" : "insured_person";
    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        userId: "d1d1d1d1-1024-4aaa-8aaa-000000001024",
        nickname: "윤서",
        email: "yunseo@example.com",
        userType,
        createdAt: "2024-03-02T09:00:00Z",
      },
    });
  }),

  // 고객이 요청건별로 받은 제안 목록 (이슈 #78) — 대시보드 /reports와 분리된 전용 목.
  // 🏷 API 스펙 협의 필요: GET /me/received-proposals. 상태별 표현(제안 도착/검수 대기 중/종결)·NEW 배지.
  http.get(`${API_BASE_URL}/me/received-proposals`, async () => {
    await delay(400);
    const now = Date.now();
    const hoursAgo = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();

    const list = [
      {
        reportId: "a1000000-0000-4000-8000-000000000001",
        status: "AWAITING_ADOPTION",
        accidentType: "교통사고",
        title: "교통사고 · 후유장해",
        createdAt: hoursAgo(2),
        reviewedAt: hoursAgo(2),
        reportNo: "20260520-017",
        claimedMinAmount: 14_000_000,
        claimedMaxAmount: 17_500_000,
        proposalCount: 3,
        newProposalCount: 2,
        adjusterNickname: "김도현",
      },
      {
        reportId: "a1000000-0000-4000-8000-000000000002",
        status: "CLOSED",
        accidentType: "실손",
        title: "실손 · 도수치료 한도",
        createdAt: "2026-04-28T09:00:00Z",
        reviewedAt: "2026-04-28T09:00:00Z",
        reportNo: "20260415-031",
        claimedMinAmount: 3_200_000,
        claimedMaxAmount: 4_800_000,
        proposalCount: 2,
        adjusterNickname: "박준호",
      },
      {
        reportId: "a1000000-0000-4000-8000-000000000003",
        status: "CLOSED",
        accidentType: "질병",
        title: "질병 · 암진단비",
        createdAt: "2026-03-10T09:00:00Z",
        reviewedAt: "2026-03-10T09:00:00Z",
        reportNo: "20260302-008",
        claimedMinAmount: 9_000_000,
        claimedMaxAmount: 12_000_000,
        proposalCount: 1,
        adjusterNickname: null,
      },
      {
        reportId: "a1000000-0000-4000-8000-000000000004",
        status: "AWAITING_INSPECTION",
        accidentType: "상해",
        title: "상해 · 외모추상 특약",
        createdAt: "2026-06-01T09:00:00Z",
        reviewedAt: null,
        reportNo: "20260601-042",
        claimedMinAmount: 2_400_000,
        claimedMaxAmount: 3_100_000,
        proposalCount: 0,
        adjusterNickname: null,
      },
    ];

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        list,
        pagination: { page: 1, size: 10, totalElements: list.length, totalPages: 1, hasNext: false },
      },
    });
  }),

  // 고객 리포트 목록 (대시보드) — :reportId·pending-review와 충돌 없게 정확 경로.
  // §9 드리프트 필드 선반영(reportNo·claimedMin/Max·proposalCount·reviewedAt·adjusterNickname).
  http.get(`${API_BASE_URL}/reports`, async ({ request }) => {
    await delay(400);

    const url = new URL(request.url, "http://localhost");
    const page = Number(url.searchParams.get("page") ?? "0");

    // 빈 상태(0건) 주입 — E2E 빈 상태 검증용(x-mock-failure 패턴 미러)
    if (request.headers.get("x-mock-scenario") === "reports-empty") {
      return HttpResponse.json({
        status: "200",
        message: "정상 처리되었습니다.",
        data: {
          list: [],
          pagination: { page, size: 10, totalElements: 0, totalPages: 0, hasNext: false },
        },
      });
    }

    const list = [
      {
        reportId: DASHBOARD_PROPOSABLE_REPORT_ID,
        status: "MATCHED",
        accidentType: "교통사고",
        createdAt: "2026-05-20T09:00:00Z",
        reportNo: "20260520-017",
        claimedMinAmount: 14_000_000,
        claimedMaxAmount: 17_500_000,
        proposalCount: 2,
        reviewedAt: "2026-05-22T10:14:00Z",
        adjusterNickname: "김도현",
        offeredAmount: 8_500_000,
        treatment: "후유장해",
      },
      {
        reportId: DASHBOARD_AWAITING_REPORT_ID,
        status: "AWAITING_INSPECTION",
        accidentType: "실손",
        createdAt: "2026-05-12T09:00:00Z",
        reportNo: "20260512-009",
        claimedMinAmount: 3_200_000,
        claimedMaxAmount: 4_800_000,
        proposalCount: 0,
        reviewedAt: null,
        adjusterNickname: null,
        offeredAmount: null,
        treatment: null,
      },
    ];

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        list,
        pagination: {
          page,
          size: 10,
          totalElements: list.length,
          totalPages: 1,
          hasNext: false,
        },
      },
    });
  }),

  // 본인 프로필 수정 — 수정 가능 필드만 머지 후 전체 프로필 반환
  http.patch(`${API_BASE_URL}/adjusters/me/profile`, async ({ request }) => {
    await delay(700);

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return HttpResponse.json(
        { status: "400", code: "VALIDATION_ERROR", message: "입력 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    // 수정 가능 필드만 반영(읽기 전용·미지정 필드는 무시)
    const ADJUSTER_PROFILE_MUTABLE_FIELDS = [
      "headline",
      "introduction",
      "career",
      "activityRegion",
      "avatarUrl",
      "specialties",
      "careers",
    ] as const;
    for (const field of ADJUSTER_PROFILE_MUTABLE_FIELDS) {
      if (field in body) ADJUSTER_PROFILE[field] = body[field];
    }
    ADJUSTER_PROFILE.updatedAt = new Date().toISOString();

    return HttpResponse.json({
      status: "200",
      message: "수정 성공",
      data: ADJUSTER_PROFILE,
    });
  }),

  // 증빙 업로드 — 기본 성공(결정적). x-mock-failure 헤더로 실패 주입(재시도 검증용)
  http.post(`${API_BASE_URL}/uploads`, async ({ request }) => {
    await delay(800);

    if (request.headers.get("x-mock-failure") === "upload") {
      return HttpResponse.json(
        { status: "502", code: "EXTERNAL_API_ERROR", message: "업로드 처리 중 오류가 발생했습니다." },
        { status: 502 },
      );
    }

    const url = `https://cdn.example.com/uploads/${crypto.randomUUID()}/document`;
    return HttpResponse.json({ status: "200", message: "업로드 성공", data: { url } });
  }),

  // 분석 신청 생성 — 실손(medical_indemnity)만 허용, 그 외 UNSUPPORTED_OPERATION
  http.post(`${API_BASE_URL}/reports`, async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { accidentType?: string };

    if (body.accidentType !== "medical_indemnity") {
      return HttpResponse.json(
        { status: "400", code: "UNSUPPORTED_OPERATION", message: "현재 실손 의료비만 분석 가능합니다." },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        status: "202",
        message: "리포트 생성을 시작했습니다.",
        data: { reportId: crypto.randomUUID(), status: "AWAITING_INSPECTION" },
      },
      { status: 202 },
    );
  }),

  // 검수 대기 목록 (활성 손해사정사 전용) — :reportId 라우트보다 먼저 등록
  http.get(`${API_BASE_URL}/reports/pending-review`, async ({ request }) => {
    await delay(400);

    const url = new URL(request.url, "http://localhost");
    const page = Number(url.searchParams.get("page") ?? "1");
    const size = Number(url.searchParams.get("size") ?? "10");
    const accidentType = url.searchParams.get("accidentType");
    const status = url.searchParams.get("status");
    const region = url.searchParams.get("region");

    const list = PENDING_REVIEWS.filter(
      (review) =>
        (!accidentType || review.accidentType === accidentType) &&
        (!status || review.status === status) &&
        (!region || review.region === region),
    );

    // 탭 배지는 status 필터 적용 전 전체 분포 기준
    const countsByStatus = PENDING_REVIEWS.reduce<Record<string, number>>((acc, review) => {
      acc[review.status] = (acc[review.status] ?? 0) + 1;
      return acc;
    }, {});
    const statusCounts = { total: PENDING_REVIEWS.length, ...countsByStatus };

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        list,
        pagination: { page, size, totalElements: list.length, totalPages: 1, hasNext: false },
        statusCounts,
      },
    });
  }),

  // 검수 현황 요약 (하단 탭바 뱃지 + PC 요약 카드용)
  http.get(`${API_BASE_URL}/reports/pending-review/summary`, async () => {
    await delay(300);

    const pendingCount = PENDING_REVIEWS.filter(
      (review) => review.status === "AWAITING_INSPECTION",
    ).length;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { pendingCount, specialtyMatchCount: 3, dueSoonCount: 1, inProgressCount: 3 },
    });
  }),

  // 검수 보류 토글 (PC 프리뷰 패널) — 사정사별 보류를 목록 fixture에 반영.
  http.patch(`${API_BASE_URL}/reports/:reportId/hold`, async ({ params }) => {
    await delay(300);

    const reportId = typeof params.reportId === "string" ? params.reportId : "";
    const target = PENDING_REVIEWS.find((review) => review.reportId === reportId);
    if (!target) {
      return HttpResponse.json(
        { status: "404", code: "POST_NOT_FOUND", message: "리포트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    target.held = !target.held;
    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { reportId, held: target.held },
    });
  }),

  // 사정사 검수 내역 조회 (이슈 #59) — 명세 봉투 거울. status 서버 필터 + page 페이지네이션.
  // 실패/빈 시나리오는 x-mock-* 헤더로 주입(E2E override용).
  http.get(`${API_BASE_URL}/adjusters/me/reviewed-reports`, async ({ request }) => {
    await delay(400);

    const failure = request.headers.get("x-mock-failure");
    if (failure === "reviewed-forbidden") {
      return HttpResponse.json(
        { status: "403", code: "FORBIDDEN", message: "손해사정사만 접근할 수 있습니다." },
        { status: 403 },
      );
    }
    if (failure === "reviewed-unauthorized") {
      return HttpResponse.json(
        { status: "401", code: "LOGIN_REQUIRED", message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const url = new URL(request.url, "http://localhost");
    const status = url.searchParams.get("status"); // 없거나 ALL이면 전체
    const month = url.searchParams.get("month") ?? "";
    const page = Number(url.searchParams.get("page") ?? "1");
    const size = Number(url.searchParams.get("size") ?? "10");

    // 검수 이력 자체 없음(no-data) 시나리오
    const emptyAll = request.headers.get("x-mock-reviewed") === "empty";
    const source = emptyAll ? [] : REVIEWED_REPORTS;

    const filtered =
      !status || status === "ALL"
        ? source
        : source.filter((r) => r.status === status);

    const start = (page - 1) * size;
    const paged = filtered.slice(start, start + size);
    const totalPages = Math.max(1, Math.ceil(filtered.length / size));

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        summary: {
          monthlyReviewCount: emptyAll ? 0 : 18,
          previousMonthReviewCount: emptyAll ? 0 : 15,
          consultationConversionRate: emptyAll ? 0 : 62,
          consultationConvertedCount: emptyAll ? 0 : 9,
          totalCount: source.length,
        },
        filter: { status: status ?? "ALL", month },
        list: paged,
        pagination: {
          page,
          size,
          totalElements: filtered.length,
          totalPages,
          hasNext: start + size < filtered.length,
        },
      },
    });
  }),

  // 받은 제안 목록 조회 (이슈 #18/#48) — 채팅방(chatRooms)을 원천으로 동기화.
  //   같은 proposalId·status를 노출해 채팅↔proposals 정합 유지.
  //   REJECTED 제안은 목록에서 제외(받은제안 카드 UX: 거절 시 제거. ⚠️ 노출 정책 백엔드 확인 중 — TEMP §5-3).
  http.get(`${API_BASE_URL}/reports/:reportId/proposals`, async ({ params }) => {
    await delay(500);

    const reportId = typeof params.reportId === "string" ? params.reportId : "";
    const list = chatRooms
      .filter((room) => room.reportId === reportId && room.matchStatus !== "REJECTED")
      .map((room) => {
        const meta = CHAT_PROPOSAL_META[room.proposalId];
        return {
          proposalId: room.proposalId,
          adjusterId: room.adjusterId,
          nickname: room.adjusterName.replace(/\s*손해사정사$/, ""),
          status: room.matchStatus,
          rating: meta?.rating ?? 4.5,
          proposalSummary: meta?.proposalSummary ?? "리포트를 검토해 보고 싶습니다.",
          submittedAt: meta?.submittedAt ?? room.updatedAt,
          speciality: meta?.speciality,
          career: meta?.career,
          isNew: meta?.isNew,
          isVerified: meta?.isVerified,
          estimateMinAmount: meta?.estimateMinAmount ?? null,
          estimateMaxAmount: meta?.estimateMaxAmount ?? null,
          feeBasis: meta?.feeBasis,
        };
      });

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        target: {
          accidentType: "교통사고 · 후유장해",
          reportNo: "20260520-017",
          receivedAt: "2026.05.20",
        },
        list,
        pagination: {
          page: 1,
          size: 10,
          totalElements: list.length,
          totalPages: 1,
          hasNext: false,
        },
      },
    });
  }),

  // 제안 매칭(채택·거절) 통합 (이슈 #48) — PATCH /reports/:reportId/proposals/:proposalId {status}.
  //   ACCEPTED: 대상 방 매칭완료 + 형제(같은 reportId) 방 자동종료(REJECTED·CLOSED) 캐스케이드.
  //   REJECTED: 대상 방만 종료. 이미 확정된 방 재PATCH → 409.
  http.patch(
    `${API_BASE_URL}/reports/:reportId/proposals/:proposalId`,
    async ({ request, params }) => {
      await delay(400);

      const reportId = typeof params.reportId === "string" ? params.reportId : "";
      const proposalId =
        typeof params.proposalId === "string" ? params.proposalId : "";
      const body = (await request.json().catch(() => ({}))) as {
        status?: string;
      };
      const status = body.status === "ACCEPTED" ? "ACCEPTED" : "REJECTED";

      const target = chatRooms.find((room) => room.proposalId === proposalId);
      if (!target) {
        return HttpResponse.json(
          { status: "404", code: "POST_NOT_FOUND", message: "제안을 찾을 수 없습니다." },
          { status: 404 },
        );
      }
      if (target.matchStatus === "ACCEPTED" || target.matchStatus === "REJECTED") {
        // CONTRACT: 명세없음-임시 — 상태전이 위반 전용 code 부재, 근접 enum UNSUPPORTED_OPERATION 사용.
        return HttpResponse.json(
          {
            status: "409",
            code: "UNSUPPORTED_OPERATION",
            message: "이미 처리된 제안입니다.",
          },
          { status: 409 },
        );
      }

      if (status === "ACCEPTED") {
        target.matchStatus = "ACCEPTED";
        chatRooms
          .filter(
            (room) =>
              room.reportId === target.reportId &&
              room.proposalId !== target.proposalId,
          )
          .forEach((room) => {
            room.matchStatus = "REJECTED";
            room.roomStatus = "CLOSED";
          });

        return HttpResponse.json({
          status: "200",
          message: "매칭이 완료되었습니다.",
          data: {
            reportId,
            proposalId,
            adjusterId: target.adjusterId,
            reportStatus: "CLOSED",
            reviewStatus: "ACCEPTED",
          },
        });
      }

      target.matchStatus = "REJECTED";
      target.roomStatus = "CLOSED";

      return HttpResponse.json({
        status: "200",
        message: "제안을 거절했습니다.",
        data: {
          reportId,
          proposalId,
          adjusterId: target.adjusterId,
          reportStatus: "AWAITING_ADOPTION",
          reviewStatus: "REJECTED",
        },
      });
    },
  ),

  // 제안 거절 (사정사별) — 성공 시 해당 제안은 목록에서 제외
  http.patch(
    `${API_BASE_URL}/reports/:reportId/proposals/:adjusterId/reject`,
    async ({ params }) => {
      await delay(400);
      const rawReportId = typeof params.reportId === "string" ? params.reportId : "";
      const adjusterId =
        typeof params.adjusterId === "string" ? params.adjusterId : crypto.randomUUID();
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawReportId);

      rejectedProposals.add(`${rawReportId}:${adjusterId}`);

      return HttpResponse.json({
        status: "200",
        message: "제안을 거절했습니다.",
        data: { reportId: isUuid ? rawReportId : crypto.randomUUID(), adjusterId, rejected: true },
      });
    },
  ),

  // 손해사정사 목록 조회 (이슈 #47) — 반드시 :adjusterId 핸들러보다 앞에 등록
  http.get(`${API_BASE_URL}/adjusters`, async ({ request }) => {
    await delay(400);

    const url = new URL(request.url, "http://localhost");
    const keyword = (url.searchParams.get("keyword") ?? "").trim();

    // 실패 재현: 헤더 주입(개발용) 또는 검색어 "__error__"(E2E용 — 앱이 헤더를 못 보내므로 URL로 트리거)
    if (request.headers.get("x-mock-failure") === "adjusters" || keyword === "__error__") {
      return HttpResponse.json(
        {
          status: "500",
          code: "INTERNAL_SERVER_ERROR",
          message: "손해사정사 목록을 불러오지 못했습니다.",
        },
        { status: 500 },
      );
    }

    const specialty = (url.searchParams.get("specialty") ?? "").trim();
    const region = (url.searchParams.get("region") ?? "").trim();
    const sort = url.searchParams.get("sort") ?? "rating";
    const page = Number(url.searchParams.get("page") ?? "1") || 1;
    const size = Number(url.searchParams.get("size") ?? "20") || 20;

    let result = ADJUSTER_LIST_MOCK.slice();

    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(kw) ||
          a.headline.toLowerCase().includes(kw) ||
          a.activityRegion.toLowerCase().includes(kw) ||
          a.specialties.some((s) => s.toLowerCase().includes(kw)),
      );
    }

    if (specialty && specialty !== "전체") {
      result = result.filter((a) => a.specialties.includes(specialty));
    }

    if (region) {
      if (region === "그 외 지역") {
        result = result.filter(
          (a) =>
            !["서울", "경기", "인천"].some((r) => a.activityRegion.includes(r)),
        );
      } else {
        result = result.filter((a) => a.activityRegion.includes(region));
      }
    }

    result.sort((a, b) => {
      switch (sort) {
        case "review":
          return b.reviewCount - a.reviewCount;
        case "career":
          return b.career - a.career;
        case "consultCount":
          return b.completedConsultCount - a.completedConsultCount;
        case "rating":
        default:
          return b.averageRating - a.averageRating;
      }
    });

    const totalElements = result.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const start = (page - 1) * size;
    const pageItems = result.slice(start, start + size);

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        list: pageItems,
        pagination: {
          page,
          size,
          totalElements,
          totalPages,
          hasNext: page < totalPages,
        },
        meta: {
          totalAdjusterCount: 320,
          averageRating: 4.8,
          totalConsultCount: 12_400,
          averageCareer: 11,
        },
      },
    });
  }),

  // 사정사 후기 등록 (이슈 #76) — 성공 201, 같은 adjusterId 재등록 시 409 DUPLICATE_RESOURCE.
  // 등록분은 buildAdjusterProfile.recentReviews에 합류(score→score, createdAt→reviewedAt) + 집계 재계산.
  http.post(`${API_BASE_URL}/adjusters/:adjusterId/reviews`, async ({ request, params }) => {
    await delay(500);

    const rawAdjusterId = typeof params.adjusterId === "string" ? params.adjusterId : "";
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawAdjusterId);
    const adjusterId = isUuid ? rawAdjusterId : crypto.randomUUID();

    const body = (await request.json().catch(() => ({}))) as {
      score?: number;
      content?: string;
    };

    if (typeof body.score !== "number" || body.score < 1 || body.score > 5) {
      return HttpResponse.json(
        { status: "400", code: "VALIDATION_ERROR", message: "별점을 선택해 주세요." },
        { status: 400 },
      );
    }

    if (submittedReviews.has(adjusterId)) {
      return HttpResponse.json(
        { status: "409", code: "DUPLICATE_RESOURCE", message: "이미 등록된 리뷰입니다." },
        { status: 409 },
      );
    }

    const createdAt = new Date().toISOString();
    submittedReviews.set(adjusterId, [
      {
        nickname: maskNickname("윤서"),
        score: body.score,
        item: "",
        reviewedAt: createdAt,
        content: body.content ?? "",
      },
    ]);

    return HttpResponse.json(
      {
        status: "201",
        message: "리뷰가 등록되었습니다.",
        data: {
          reviewId: crypto.randomUUID(),
          adjusterId,
          score: body.score,
          createdAt,
        },
      },
      { status: 201 },
    );
  }),

  // 손해사정사 공개 프로필 조회 (이슈 #32)
  http.get(`${API_BASE_URL}/adjusters/:adjusterId`, async ({ params }) => {
    await delay(500);

    const adjusterId =
      typeof params.adjusterId === "string"
        ? params.adjusterId
        : crypto.randomUUID();

    if (adjusterId === ADJUSTER_NOT_FOUND_ID) {
      return HttpResponse.json(
        { status: "404", code: "USER_NOT_FOUND", message: "손해사정사를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 응답 adjusterId는 zod uuid 검증을 통과해야 함. 비-uuid 진입은 uuid로 대체.
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adjusterId);
    const responseAdjusterId = isUuid ? adjusterId : crypto.randomUUID();
    const withReviews = adjusterId !== ADJUSTER_EMPTY_REVIEWS_ID;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: buildAdjusterProfile(responseAdjusterId, withReviews),
    });
  }),

  // 리포트 상세 조회
  // ⚠️ 명세 드리프트: 고객측(issue: CONFIRMED/TRUSTED/INFO)·사정사측(reviewIssues 리치) 동일 URL.
  //   양측 스키마가 unknown 키를 strip하므로 superset 응답으로 둘 다 통과시킴.
  http.get(`${API_BASE_URL}/reports/:reportId`, async ({ params }) => {
    await delay(500);

    const reportId =
      typeof params.reportId === "string"
        ? params.reportId
        : crypto.randomUUID();

    // MATCHED 클릭스루용 안정 uuid — 상세→리뷰 작성 왕복 시 동일 MATCHED 응답 보장.
    const isCustomerSample =
      reportId === "test-id-123" || reportId === DASHBOARD_PROPOSABLE_REPORT_ID;

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId);
    const responseReportId = isUuid ? reportId : crypto.randomUUID();

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        reportId: responseReportId,
        status: isCustomerSample ? "MATCHED" : "AWAITING_INSPECTION",
        accidentType: "교통사고(후유장해)",
        treatment: "우측 슬관절 후방십자인대 파열",
        claimedMinAmount: isCustomerSample ? 13_500_000 : 12_000_000,
        claimedMaxAmount: isCustomerSample ? 17_000_000 : 18_000_000,
        offeredAmount: 8_500_000,
        applicableGuarantees: ["상해후유장해 담보", "골절 진단비 특약", "입원·통원 일당"],
        omittedSpecialContract: ["외모변형 장해특약"],
        basisTermsPrecedents: [
          "약관 제12조 (후유장해 보험금 산정기준)",
          "분쟁조정 2023-1456 (장해등급 재산정 인정 사례)",
          "대법원 2019다○○○○ (후유장해 인과관계 판단)",
        ],
        issue: [
          {
            title: "장해등급 과소 산정 가능",
            opinion: "현재 자료만으로는 12급 적용을 단정하기 어려워요.",
            status: "TRUSTED",
            tag: "약관 제12조",
            impactAmount: 350,
            tags: ["약관 제12조", "분쟁조정 2023-1456"],
          },
          {
            title: "외모추상 특약 청구 누락",
            opinion: "누락분 청구 검토가 가장 확실한 출발점이에요.",
            status: "CONFIRMED",
            tag: "특약 제5조",
            impactAmount: 200,
            tags: ["특약 약관 §4", "유사사례 1456"],
          },
          {
            title: "진행 방향",
            opinion: "추가 의료자료 확보 → 재산정 순서를 권해요.",
            status: "INFO",
            tag: "분쟁조정 절차",
          },
        ],
        question: "보험금이 적게 나온 것 같아요",
        confidenceLevel: "HIGH",
        reportNo: "20260520-017",
        adjusterId: isCustomerSample ? CUSTOMER_SAMPLE_ADJUSTER_ID : crypto.randomUUID(),
        reviewComment: isCustomerSample
          ? "누락된 청구 검토가 가능한 출발점입니다. 장해등급은 재검사 결과를 보고 판단하는 편이 안전합니다."
          : null,
        reviewedAt: isCustomerSample ? "2026.05.22" : null,
        adjuster: { nickname: "정우성", career: "12년 경력 손해사정사" },

        caseId: "20260531-042",
        accidentDate: "2026.05.01",
        insuranceName: "OO손해보험 · 행복드림",
        hospitalizations: [
          {
            hospitalStart: "2026.05.02",
            hospitalEnd: "2026.05.18",
            hospitalReason: "후방십자인대 파열 수술",
          },
          {
            hospitalStart: "2026.06.10",
            hospitalEnd: "2026.06.21",
            hospitalReason: "재활 및 관절 가동범위 회복 재입원",
          },
        ],
        description:
          "퇴근길 신호 대기 중 후방 추돌 사고를 당했습니다. 사고 직후 우측 무릎 통증과 부종이 심해 응급실에 내원했고, 정밀검사 결과 후방십자인대 파열 진단을 받아 입원 치료 후 수술을 받았습니다.",
        client: {
          maskedName: "윤O서",
          ageBand: "만 34세",
          gender: "여",
          region: "서울 강남",
          joinedAt: "2024.03",
        },
        isMasked: true,
        attachments: [
          {
            id: "att-1",
            name: "진단서",
            fileType: "PDF",
            pageCount: 2,
            url: "https://cdn.example.com/reports/att-1.pdf",
            issuedBy: "강남세브란스병원",
            issuedAt: "2026.05.18",
            aiSummary:
              "우측 슬관절 후방십자인대 완전 파열, 관절경적 재건술 시행. 향후 장해 잔존 가능성 명시.",
          },
          {
            id: "att-2",
            name: "MRI 영상 판독지",
            fileType: "PDF",
            pageCount: 1,
            url: "https://cdn.example.com/reports/att-2.pdf",
            issuedBy: "강남세브란스병원 영상의학과",
            issuedAt: "2026.05.03",
            aiSummary: "후방십자인대 연속성 소실 확인, 동반 반월상연골 손상 의심.",
          },
          {
            id: "att-3",
            name: "입퇴원 확인서",
            fileType: "JPG",
            pageCount: null,
            url: "https://cdn.example.com/reports/att-3.jpg",
            issuedBy: "병원 발행",
            issuedAt: "2026.05.18",
            aiSummary: null,
          },
        ],
        // ⚠️ 명세 드리프트: 명세 issue는 string[]. 리치 reviewIssues 별도 키로 superset 반환.
        reviewIssues: [
          {
            issueId: "issue-1",
            title: "후유장해 등급 재산정",
            description:
              "AI 초안은 14급으로 추정했으나, 관절 운동범위 제한 정도를 고려하면 12급 적용 여지가 있습니다.",
            impactAmount: 3_500_000,
            reviewStatus: "PENDING",
            modifiedReason: null,
            excludedReason: null,
            adjusterOpinion: null,
            tags: ["약관 제12조", "분쟁조정 2023-1456"],
            isNew: false,
          },
          {
            issueId: "issue-2",
            title: "입원 일당 미반영분",
            description: "입원 17일 중 초안에 14일만 반영되어 3일분 누락 추정.",
            impactAmount: 600_000,
            reviewStatus: "PENDING",
            modifiedReason: null,
            excludedReason: null,
            adjusterOpinion: null,
            tags: ["특약 제5조"],
            isNew: false,
          },
          {
            issueId: "issue-3",
            title: "외모변형 장해 특약 적용",
            description:
              "수술 흉터 관련 외모변형 장해 특약 청구 가능성 검토 항목.",
            impactAmount: null,
            reviewStatus: "PENDING",
            modifiedReason: null,
            excludedReason: null,
            adjusterOpinion: null,
            tags: ["외모변형 장해특약"],
            isNew: false,
          },
        ],
      },
    });
  }),

  // 검수 반영 제출 (사정사) — body echo, 검수완료 시 AWAITING_ADOPTION
  http.patch(`${API_BASE_URL}/reports/:reportId`, async ({ request, params }) => {
    await delay(600);

    if (request.headers.get("x-mock-failure") === "submit-review") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "검수 반영 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as { status?: string };
    const reportId =
      typeof params.reportId === "string"
        ? params.reportId
        : crypto.randomUUID();

    return HttpResponse.json({
      status: "200",
      message: "검수 내용이 반영되었습니다.",
      data: { reportId, status: body.status ?? "AWAITING_ADOPTION" },
    });
  }),
];
