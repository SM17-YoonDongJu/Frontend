import { delay, http, HttpResponse } from "msw";
import { camelToSnakeDeep, toSnakeKey } from "@/shared/api/case-convert";
import { API_BASE_URL } from "@/shared/api/config";
import {
  consumeReissue,
  isAccessTokenExpired,
  isLoggedOut,
  setLoggedOut,
} from "@/shared/mocks/auth-token-state";

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
const EXTRA_REGIONS = ["서울 송파구", "경기 고양시", "인천 부평구", "대구 수성구", "광주 서구"] as const;

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
    activityRegion: "서울 강남구 · 경기 성남시",
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
    activityRegion: "서울 서초구",
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
    activityRegion: "인천 연수구 · 경기 부천시",
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
    activityRegion: "경기 수원시",
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
    activityRegion: "부산 해운대구 · 경남 창원시",
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
    activityRegion: "대전 유성구 · 충남 천안시",
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

// 검수 내역 목 데이터 (이슈 #59/#130) — GET /adjusters/me/reviewed-reports.
// 명세 items[] 7필드(report_id·case_no·title·accident_type·region·status·reviewed_at) 거울.
// status enum: SENT/COUNSELING/REJECTED/ACCEPTED.
const REVIEWED_REPORTS = [
  { reportId: "b0000000-0000-4000-8000-000000000021", caseNo: "20260605-021", title: "후유장해 · 십자인대 파열 등급 재산정", accidentType: "disability", region: "서울 강남구", status: "COUNSELING", reviewedAt: "2026-06-05T09:12:00" },
  { reportId: "b0000000-0000-4000-8000-000000000018", caseNo: "20260603-018", title: "교통사고 · 일실수입 과소 산정", accidentType: "traffic", region: "경기 성남시", status: "ACCEPTED", reviewedAt: "2026-06-03T14:03:00" },
  { reportId: "b0000000-0000-4000-8000-000000000014", caseNo: "20260530-014", title: "실손 의료비 · 비급여 도수치료 한도 분쟁", accidentType: "medical_indemnity", region: "인천 연수구", status: "SENT", reviewedAt: "2026-05-30T10:20:00" },
  { reportId: "b0000000-0000-4000-8000-000000000009", caseNo: "20260528-009", title: "후유장해 · 요추 추간판탈출 특약 누락", accidentType: "disability", region: "서울 송파구", status: "COUNSELING", reviewedAt: "2026-05-28T11:40:00" },
  { reportId: "b0000000-0000-4000-8000-000000000006", caseNo: "20260525-006", title: "암·진단비 · 유사암 분류 쟁점", accidentType: "cancer_diagnosis", region: "서울 종로구", status: "ACCEPTED", reviewedAt: "2026-05-25T09:05:00" },
  { reportId: "b0000000-0000-4000-8000-000000000003", caseNo: "20260522-003", title: "교통사고 · 경추 염좌 향후 치료비 미반영", accidentType: "traffic", region: "서울 마포구", status: "REJECTED", reviewedAt: "2026-05-22T16:30:00" },
  { reportId: "b0000000-0000-4000-8000-000000000017", caseNo: "20260520-017", title: "후유장해 · 견관절 회전근개 파열", accidentType: "disability", region: "경기 수원시", status: "COUNSELING", reviewedAt: "2026-05-20T13:15:00" },
  { reportId: "b0000000-0000-4000-8000-000000000011", caseNo: "20260518-011", title: "화재 · 가재도구 손해액 산정", accidentType: "fire", region: "광주 서구", status: "ACCEPTED", reviewedAt: "2026-05-18T10:00:00" },
  { reportId: "b0000000-0000-4000-8000-000000000008", caseNo: "20260515-008", title: "배상책임 · 대인 사고 위자료 쟁점", accidentType: "liability", region: "부산 해운대구", status: "SENT", reviewedAt: "2026-05-15T15:50:00" },
  { reportId: "b0000000-0000-4000-8000-000000000004", caseNo: "20260512-004", title: "실손 의료비 · 통원 한도 적용", accidentType: "medical_indemnity", region: "대구 수성구", status: "COUNSELING", reviewedAt: "2026-05-12T09:40:00" },
  { reportId: "b0000000-0000-4000-8000-000000000002", caseNo: "20260509-002", title: "후유장해 · 안면부 외모추상 장해", accidentType: "disability", region: "서울 강서구", status: "ACCEPTED", reviewedAt: "2026-05-09T11:25:00" },
  { reportId: "b0000000-0000-4000-8000-000000000015", caseNo: "20260506-015", title: "교통사고 · 다발성 늑골 골절", accidentType: "traffic", region: "경기 고양시", status: "REJECTED", reviewedAt: "2026-05-06T08:40:00" },
  { reportId: "b0000000-0000-4000-8000-000000000010", caseNo: "20260503-010", title: "암·진단비 · 재진단암 인정 범위", accidentType: "cancer_diagnosis", region: "서울 용산구", status: "COUNSELING", reviewedAt: "2026-05-03T14:10:00" },
  { reportId: "b0000000-0000-4000-8000-000000000005", caseNo: "20260430-005", title: "실손 의료비 · 비급여 주사료 분쟁", accidentType: "medical_indemnity", region: "부산 부산진구", status: "ACCEPTED", reviewedAt: "2026-04-30T10:35:00" },
] as const;

// 알림 목록 목 데이터 (명세 Done, BE PR #117) — items+unread_count+페이지네이션.
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
  { id: "d0000000-0000-4000-8000-000000000001", type: "REVIEW_COMPLETE", title: "검수가 완료됐어요", body: "김도현 사정사님이 리포트를 검수했어요.", isRead: false, createdAt: todayAgo(2) },
  { id: "d0000000-0000-4000-8000-000000000002", type: "RECEIVED_PROPOSAL", title: "새 제안 2건 도착", body: "교통사고 리포트에 상담 제안이 왔어요.", isRead: false, createdAt: todayAgo(5) },
  { id: "d0000000-0000-4000-8000-000000000006", type: "CHAT_MESSAGE", title: "새 메시지가 도착했어요", body: null, isRead: true, createdAt: yesterdayAt(18) },
  { id: "d0000000-0000-4000-8000-000000000003", type: "CONSULT_ACCEPTED", title: "상담이 수락됐어요", body: "정우성 사정사님이 상담을 수락했어요.", isRead: true, createdAt: yesterdayAt(15) },
  { id: "d0000000-0000-4000-8000-000000000004", type: "ANALYSIS_COMPLETE", title: "분석이 완료됐어요", body: "제출하신 서류 분석 리포트가 준비됐어요.", isRead: true, createdAt: yesterdayAt(11) },
  { id: "d0000000-0000-4000-8000-000000000005", type: "IDENTITY_VERIFIED", title: "본인 인증 완료", body: "계정 본인 인증이 완료됐어요.", isRead: true, createdAt: "2026-05-18T09:00:00Z" },
];

// 고객 대시보드 — 받은 제안이 연결된 리포트(①)의 안정 uuid.
export const DASHBOARD_PROPOSABLE_REPORT_ID =
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DASHBOARD_AWAITING_REPORT_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

// 고객 리포트 목 원천 (이슈 #153) — /reports 목록과 /reports/{id}/proposals target·건수가 같은 메타를 보게 모듈 스코프.
// 대시보드가 집계·미리보기로 쓰는 기존 2건 — 항상 목록 맨 앞(page 1 앞부분) 유지.
const HEAD_REPORTS = [
  {
    reportId: DASHBOARD_PROPOSABLE_REPORT_ID,
    status: "CLOSED",
    accidentType: "교통사고",
    createdAt: "2026-05-20T09:00:00Z",
    reportNo: "20260520-017",
    claimedMinAmount: 14_000_000,
    claimedMaxAmount: 17_500_000,
    proposalCount: 3,
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

// 내 리포트 목록(무한 조회): 2페이지 이상 분량. 앞 2건은 HEAD_REPORTS 그대로.
const REPORT_LIST_SOURCE = [
  ...HEAD_REPORTS,
  {
    reportId: "b2c9d0e1-3f4a-4b5c-8d6e-7f8a9b0c1d2e",
    status: "COUNSELING",
    accidentType: "골절",
    createdAt: "2026-05-08T09:00:00Z",
    reportNo: "20260508-005",
    claimedMinAmount: 5_500_000,
    claimedMaxAmount: 7_200_000,
    proposalCount: 3,
    reviewedAt: "2026-05-10T14:00:00Z",
    adjusterNickname: "이서준",
    offeredAmount: 6_000_000,
    treatment: "입원",
  },
  {
    reportId: "c3d0e1f2-4a5b-4c6d-9e7f-8a9b0c1d2e3f",
    status: "AWAITING_ADOPTION",
    accidentType: "교통사고",
    createdAt: "2026-04-30T09:00:00Z",
    reportNo: "20260430-118",
    claimedMinAmount: 9_800_000,
    claimedMaxAmount: 12_400_000,
    proposalCount: 5,
    reviewedAt: "2026-05-02T11:20:00Z",
    adjusterNickname: "박지훈",
    offeredAmount: 10_500_000,
    treatment: "통원",
  },
  {
    reportId: "d4e1f2a3-5b6c-4d7e-8f9a-9b0c1d2e3f4a",
    status: "CLOSED",
    accidentType: "실손",
    createdAt: "2026-04-22T09:00:00Z",
    reportNo: "20260422-077",
    claimedMinAmount: 1_800_000,
    claimedMaxAmount: 2_600_000,
    proposalCount: 1,
    reviewedAt: "2026-04-24T09:30:00Z",
    adjusterNickname: "최유나",
    offeredAmount: 2_100_000,
    treatment: "통원",
  },
  {
    reportId: "e5f2a3b4-6c7d-4e8f-9a0b-0c1d2e3f4a5b",
    status: "AWAITING_INSPECTION",
    accidentType: "골절",
    createdAt: "2026-04-15T09:00:00Z",
    reportNo: "20260415-031",
    claimedMinAmount: 4_100_000,
    claimedMaxAmount: 5_900_000,
    proposalCount: 0,
    reviewedAt: null,
    adjusterNickname: null,
    offeredAmount: null,
    treatment: null,
  },
  {
    reportId: "f6a3b4c5-7d8e-4f9a-8b1c-1d2e3f4a5b6c",
    status: "CLOSED",
    accidentType: "교통사고",
    createdAt: "2026-04-03T09:00:00Z",
    reportNo: "20260403-208",
    claimedMinAmount: 7_300_000,
    claimedMaxAmount: 9_100_000,
    proposalCount: 4,
    reviewedAt: "2026-04-05T16:45:00Z",
    adjusterNickname: "정하윤",
    offeredAmount: 8_000_000,
    treatment: "입원",
  },
  {
    reportId: "a7b4c5d6-8e9f-4a0b-9c2d-2e3f4a5b6c7d",
    status: "NOT_SELECTED",
    accidentType: "실손",
    createdAt: "2026-03-26T09:00:00Z",
    reportNo: "20260326-142",
    claimedMinAmount: 2_900_000,
    claimedMaxAmount: 3_700_000,
    proposalCount: 2,
    reviewedAt: "2026-03-28T10:00:00Z",
    adjusterNickname: "강도윤",
    offeredAmount: 3_200_000,
    treatment: "통원",
  },
];

const toReceivedAt = (iso: string) => iso.slice(0, 10).replaceAll("-", ".");

// 제안 목록 target 파생용 리포트 메타 (이슈 #153) — /reports 원천 + 받은 제안 전용 리포트(#78).
type ProposalTarget = { accidentType: string; reportNo: string; receivedAt: string };

const PROPOSAL_TARGETS: Record<string, ProposalTarget> = {
  ...Object.fromEntries(
    REPORT_LIST_SOURCE.map((report): [string, ProposalTarget] => [
      report.reportId,
      {
        accidentType: report.treatment
          ? `${report.accidentType} · ${report.treatment}`
          : report.accidentType,
        reportNo: report.reportNo,
        receivedAt: toReceivedAt(report.createdAt),
      },
    ]),
  ),
  "a1000000-0000-4000-8000-000000000002": {
    accidentType: "실손 · 도수치료 한도",
    reportNo: "20260415-031",
    receivedAt: "2026.04.28",
  },
  "a1000000-0000-4000-8000-000000000003": {
    accidentType: "질병 · 암진단비",
    reportNo: "20260302-008",
    receivedAt: "2026.03.10",
  },
};

// 리포트 ① 외 proposal_count>0 리포트의 고정 제안 목 (이슈 #153) — 채팅방 미연결 정적 데이터.
// 리포트의 adjusterNickname을 명단에 포함하고, REJECTED는 목록 필터로 건수가 깨져 시드에 쓰지 않는다.
type ExtraProposal = {
  reportId: string;
  proposalId: string;
  adjusterId: string;
  nickname: string;
  status: "SENT" | "COUNSELING" | "ACCEPTED" | "REJECTED";
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
};

const EXTRA_PROPOSAL_SUMMARIES = [
  "리포트 검토 결과 추가 청구 여지가 있어 상담을 제안드립니다.",
  "약관·특약 기준으로 산정 금액을 다시 살펴보고 싶습니다.",
  "유사 사건을 다뤄본 경험이 있어 도움을 드릴 수 있을 것 같습니다.",
  "제출 서류 기준으로 보완 청구 가능성을 검토해 보겠습니다.",
  "산정 근거를 함께 확인하며 진행 방향을 안내드리겠습니다.",
];

function makeExtraProposals(
  reportId: string,
  base: number,
  speciality: string,
  submittedDate: string,
  members: { nickname: string; status: "SENT" | "COUNSELING" | "ACCEPTED" }[],
): ExtraProposal[] {
  return members.map((member, i) => ({
    reportId,
    proposalId: `e1000000-0000-4000-8000-${String(base + i).padStart(12, "0")}`,
    adjusterId: `e2000000-0000-4000-8000-${String(base + i).padStart(12, "0")}`,
    nickname: member.nickname,
    status: member.status,
    rating: [4.8, 4.6, 4.9, 4.7, 4.5][i % 5] ?? 4.7,
    proposalSummary:
      EXTRA_PROPOSAL_SUMMARIES[(base / 100 + i) % 5] ?? "리포트를 검토해 보고 싶습니다.",
    submittedAt: `${submittedDate}T${String(9 + i).padStart(2, "0")}:00:00+09:00`,
    speciality,
    career: [12, 8, 15, 6, 10][i % 5] ?? 10,
    isNew: i === 0,
    isVerified: true,
    estimateMinAmount: null,
    estimateMaxAmount: null,
    feeBasis: "상담 시 서면 안내",
  }));
}

const EXTRA_PROPOSALS: ExtraProposal[] = [
  // 골절 20260508-005 — 상담 진행 중 3건
  ...makeExtraProposals("b2c9d0e1-3f4a-4b5c-8d6e-7f8a9b0c1d2e", 100, "골절 전문", "2026-05-10", [
    { nickname: "이서준", status: "COUNSELING" },
    { nickname: "한지원", status: "SENT" },
    { nickname: "문태호", status: "SENT" },
  ]),
  // 교통사고 20260430-118 — 채택 대기 5건
  ...makeExtraProposals("c3d0e1f2-4a5b-4c6d-9e7f-8a9b0c1d2e3f", 200, "교통사고 전문", "2026-05-02", [
    { nickname: "박지훈", status: "COUNSELING" },
    { nickname: "서예린", status: "SENT" },
    { nickname: "권도윤", status: "SENT" },
    { nickname: "임채원", status: "SENT" },
    { nickname: "백승호", status: "SENT" },
  ]),
  // 실손 20260422-077 — 종결(채택 1건)
  ...makeExtraProposals("d4e1f2a3-5b6c-4d7e-8f9a-9b0c1d2e3f4a", 300, "실손 전문", "2026-04-24", [
    { nickname: "최유나", status: "ACCEPTED" },
  ]),
  // 교통사고 20260403-208 — 종결(채택 1 + 미채택 3)
  ...makeExtraProposals("f6a3b4c5-7d8e-4f9a-8b1c-1d2e3f4a5b6c", 400, "교통사고 전문", "2026-04-05", [
    { nickname: "정하윤", status: "ACCEPTED" },
    { nickname: "김세인", status: "SENT" },
    { nickname: "조민재", status: "SENT" },
    { nickname: "홍시원", status: "SENT" },
  ]),
  // 실손 20260326-142 — 미채택 종료 2건
  ...makeExtraProposals("a7b4c5d6-8e9f-4a0b-9c2d-2e3f4a5b6c7d", 500, "실손 전문", "2026-03-28", [
    { nickname: "강도윤", status: "SENT" },
    { nickname: "신아름", status: "SENT" },
  ]),
  // 받은 제안 전용(#78) 실손 · 도수치료 한도 — 종결(채택 1 + 1)
  ...makeExtraProposals("a1000000-0000-4000-8000-000000000002", 600, "실손 전문", "2026-04-20", [
    { nickname: "박준호", status: "ACCEPTED" },
    { nickname: "오민석", status: "SENT" },
  ]),
  // 받은 제안 전용(#78) 질병 · 암진단비 — 1건
  ...makeExtraProposals("a1000000-0000-4000-8000-000000000003", 700, "질병 전문", "2026-03-05", [
    { nickname: "정다은", status: "SENT" },
  ]),
];

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

// 알림 설정 (이슈 #46) — PATCH가 머지로 갱신하는 모듈 스코프 가변 객체.
// 명세 V21 10필드 — 응답은 camelToSnakeDeep로 snake 미러.
const NOTIFICATION_SETTINGS: Record<string, boolean> = {
  newReviewRequest: true,
  consultMessage: true,
  settlementNotice: false,
  reviewDeadlineSoon: true,
  reviewComplete: true,
  receivedProposal: true,
  consultAccepted: true,
  analysisComplete: true,
  identityVerified: true,
  marketing: false,
  // CONTRACT(확장 등재 요청 중, 이슈 #105): 카카오톡 플러스 친구 알림 — 백엔드 미채택으로 실서버 응답엔 이 키가 없다.
  // Figma에 토글 행이 있어 FE 동작 검증용으로만 목이 제공한다(스키마는 nullish → false로 부재 방어).
  kakaoPlusFriend: false,
};

// 본인 정보 목 상태 — GET/PATCH /users/me 공유. 명세 응답 그대로 snake_case 키로 보관(계약 거울).
// 확정 응답(2026-07-14): user_id·nickname·phone_number·role·gender·region[]·avatar_url·created_at(userType 없음 → FE가 role 파생).
// CONTRACT(명세없음-확장): email·social_provider는 명세 GET 응답에 없다 — 최근 로그인 마스킹·가입경로 표시용으로만 목이 제공(스키마 nullish).
const MOCK_ME: Record<string, unknown> = {
  user_id: "d1d1d1d1-1024-4aaa-8aaa-000000001024",
  nickname: "윤서",
  phone_number: "010-1234-5678",
  gender: "F",
  region: ["서울 강남구"],
  avatar_url: null,
  created_at: "2024-03-02T09:00:00Z",
  email: "yunseo@example.com",
  social_provider: "kakao",
};

/**
 * 목 role 결정 — 기본 USER(피보험자).
 * localStorage["mock:role"]=CERTIFICATED_ADJUSTER → 파트너 전환 섹션 노출(#105).
 * localStorage["mock:userType"]="adjuster" → 사정사 화면 검증용(응답에 userType이 없으므로 role로 매핑).
 */
function resolveMockRole(): string {
  if (typeof localStorage === "undefined") return "USER";
  const roleOverride = localStorage.getItem("mock:role");
  if (roleOverride === "CERTIFICATED_ADJUSTER") return "CERTIFICATED_ADJUSTER";
  return localStorage.getItem("mock:userType") === "adjuster"
    ? "CERTIFICATED_ADJUSTER"
    : "USER";
}

// 활동 카운트 (이슈 #105) — CONTRACT(명세없음-임시): GET /users/me/activity-summary
const ACTIVITY_SUMMARY = {
  reportCount: 3,
  proposalCount: 2,
  consultCount: 1,
  closedCount: 4,
};

// 내 보험 (이슈 #105) — GET·POST /users/me/insurances (백엔드 확정 2026-07-13).
// policyFileUrl 있음(증권 등록됨) 1건 + 없음(증권 미등록) 1건 — Figma 목업 2건 거울.
const MOCK_INSURANCES: Array<Record<string, unknown>> = [
  {
    id: "e1000000-0000-4000-8000-000000000001",
    insurerName: "OO손해보험",
    productName: "무배당 행복드림 종합보험",
    policyNo: "100-2024-558***",
    enrolledAt: "2024-03-15",
    coverages: ["상해후유장해", "골절진단비", "입원일당"],
    matchStatus: "MATCHED",
    // CONTRACT(확장 등재 요청 중, 이슈 #105): GET list 확정 응답엔 policyFileUrl이 없다. 카드 배지("증권 등록됨/미등록")가
    // 이 필드를 요구해 백엔드에 등재 요청 중 — 실서버에선 아직 안 온다(→ 전부 "미등록"으로 표시됨).
    policyFileUrl: "https://cdn.example.com/policies/e1000000-0001.pdf",
  },
  {
    id: "e1000000-0000-4000-8000-000000000002",
    insurerName: "△△생명",
    productName: "든든 의료실비보험",
    policyNo: "220-2023-114***",
    enrolledAt: "2023-08-02",
    coverages: ["실손의료비", "수술비"],
    matchStatus: "UNMATCHED",
    // CONTRACT(확장 등재 요청 중, 이슈 #105): 위와 동일 — 증권 미등록 케이스.
    policyFileUrl: null,
  },
];

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

// 손해사정사 자격 신청 상태(이슈 #44) — POST가 세우고 GET .../me가 읽는 모듈 스코프 상태.
// 기본 null(미신청 → GET 404 POST_NOT_FOUND → NOT_APPLIED → 폼).
type MockDocumentReview = {
  type: "LICENSE" | "REGISTRATION" | "ID_CARD";
  status: "PENDING" | "APPROVED" | "RESUBMIT_REQUIRED";
};
type MockAdjusterApplication = {
  applicationId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  name: string;
  speciality: string;
  licenseNo: string | null;
  documents: MockDocumentReview[];
  rejectedAt: string | null;
  rejectReason: string | null;
};

let adjusterApplicationState: MockAdjusterApplication | null = null;

// 시나리오 override(E2E)용 고정 페이로드 빌더 — status GET을 상태별로 강제 렌더.
function buildAdjusterApplication(
  status: "PENDING" | "APPROVED" | "REJECTED",
): MockAdjusterApplication {
  const base: MockAdjusterApplication = {
    applicationId: "aaaaaaaa-0044-4000-8000-000000000044",
    status,
    submittedAt: "2026-07-05T09:00:00Z",
    name: "김상정",
    speciality: "종합",
    licenseNo: "제2014-0087호",
    documents: [
      { type: "LICENSE", status: "PENDING" },
      { type: "REGISTRATION", status: "PENDING" },
      { type: "ID_CARD", status: "PENDING" },
    ],
    rejectedAt: null,
    rejectReason: null,
  };

  if (status === "APPROVED") {
    return {
      ...base,
      documents: base.documents.map((d) => ({ ...d, status: "APPROVED" })),
    };
  }

  if (status === "REJECTED") {
    return {
      ...base,
      documents: [
        { type: "LICENSE", status: "APPROVED" },
        { type: "REGISTRATION", status: "RESUBMIT_REQUIRED" },
        { type: "ID_CARD", status: "APPROVED" },
      ],
      rejectedAt: "2026-07-07T13:20:00Z",
      rejectReason:
        "등록확인서 이미지가 흐려 식별이 어렵습니다. 금감원 등록확인서를 다시 제출해 주세요.",
    };
  }

  return base;
}

// ── 채팅(이슈 #48) 모듈 스코프 가변 상태 ─────────────────────────────
// senderId 정합: 내 메시지는 MOCK_ME_ID(= users/me 목의 userId uuid와 동일해야 mine 판별이 맞음).
// userId uuid 전환 확정(#40) — /users/me 목이 uuid를 내려주므로 여기도 같은 값 사용.
const MOCK_ME_ID = "d1d1d1d1-1024-4aaa-8aaa-000000001024";

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
  roomStatus: "ACTIVE" | "CLOSED";
  lastMessageAt: string;
  proposalId: string;
  matchStatus: MockMatchStatus;
  reportTypeLabel: string; // accidentType 슬러그(traffic·disability…)
  unreadCount: number;
}

// 메시지 첨부(GET/POST messages 응답 shape) — 조회용 url·원본명·MIME.
interface MockMessageAttachment {
  url: string;
  name: string;
  contentType: string;
}

interface MockChatMessage {
  messageId: string;
  senderId: string;
  content: string;
  createdAt: string;
  attachment?: MockMessageAttachment;
}

// 업로드된 첨부 임시 보관(key→메타) — 메시지 전송 시 attachment_key로 회수해 url 부여.
const uploadedChatAttachments = new Map<string, MockMessageAttachment>();

// 첨부 MIME으로 message_type 파생(서버 규칙: 이미지→IMAGE, 그 외 첨부→FILE, 없으면 TEXT).
function deriveMessageType(attachment?: MockMessageAttachment) {
  if (!attachment) return "TEXT";
  return attachment.contentType.startsWith("image/") ? "IMAGE" : "FILE";
}

// MockChatRoom → GET /chats 응답 room(camel; camelToSnakeDeep가 snake로 변환).
function toChatRoomDto(room: MockChatRoom) {
  return {
    chatRoomId: room.chatRoomId,
    reportId: room.reportId,
    proposalId: room.proposalId,
    roomStatus: room.roomStatus,
    matchStatus: room.matchStatus,
    counterpart: {
      userId: room.adjusterId,
      name: room.adjusterName,
      avatarUrl: room.avatarUrl,
    },
    lastMessage: room.lastMessage,
    lastMessageAt: room.lastMessageAt,
    unreadCount: room.unreadCount,
    caseNo: room.caseNo,
    reportTypeLabel: room.reportTypeLabel,
  };
}

// MockChatMessage → GET/POST messages 응답 message(camel).
function toChatMessageDto(message: MockChatMessage) {
  return {
    messageId: message.messageId,
    senderId: message.senderId,
    messageType: deriveMessageType(message.attachment),
    content: message.content ? message.content : null,
    attachment: message.attachment ?? null,
    isMine: message.senderId === MOCK_ME_ID,
    createdAt: message.createdAt,
  };
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
    reportTypeLabel: "disability",
    unreadCount: 2,
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
    reportTypeLabel: "disability",
    unreadCount: 0,
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
    reportTypeLabel: "disability",
    unreadCount: 0,
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

// 고객 홈 대시보드 BFF 목 (이슈 #142) — GET /users/me/dashboard. Figma 시안 값 거울.
// 제안 3건(320/430/480만원, 평균 410만원)·검수완료 1건·김민준 새 메시지·무릎 십자인대 파열 리포트.
const DASHBOARD_MOCK = {
  reportCount: 3,
  activeReport: {
    reportId: DASHBOARD_PROPOSABLE_REPORT_ID,
    title: "무릎 십자인대 파열",
    accidentType: "medical_indemnity",
    status: "AWAITING_ADOPTION",
    createdAt: "2026-07-14T09:00:00Z",
    firstReviewedAt: "2026-07-16T09:00:00Z",
    proposalCount: 3,
  },
  proposalSummary: {
    count: 3,
    minAmount: 3_200_000,
    maxAmount: 4_800_000,
    avgAmount: 4_100_000,
    items: [
      { proposalId: "c2000000-0000-4000-8000-000000000001", adjusterId: CHAT_ADJUSTER_1_ID, nickname: "김민준", career: 12, speciality: "근골격계", estimateMinAmount: 4_200_000, estimateMaxAmount: 4_800_000 },
      { proposalId: "c2000000-0000-4000-8000-000000000002", adjusterId: CHAT_ADJUSTER_2_ID, nickname: "이서연", career: 9, speciality: "교통사고", estimateMinAmount: 4_000_000, estimateMaxAmount: 4_300_000 },
      { proposalId: "c2000000-0000-4000-8000-000000000003", adjusterId: CHAT_ADJUSTER_3_ID, nickname: "박준호", career: 15, speciality: "실손 의료비", estimateMinAmount: 3_000_000, estimateMaxAmount: 3_200_000 },
    ],
  },
  todos: {
    unreadProposalCount: 3,
    unreadReviewCompleteCount: 1,
    unreadChat: {
      chatRoomId: CHAT_ROOM_1_ID,
      adjusterNickname: "김민준",
      lastMessage: "서류 검토가 끝났습니다.",
    },
  },
};

export const handlers = [
  http.get("/api/ping", () => HttpResponse.json({ message: "pong (mocked)" })),

  // 손해사정사 자격 신청 생성 (#44) — 전역 봉투 거울. 성공 201 + { applicationId, status: PENDING }.
  //   필수값 누락→400 MISSING_REQUIRED_FIELD, 자격증 번호·사본 둘 다 없음→400 MISSING_REQUIRED_FIELD,
  //   진행중/승인 상태에서 재-POST→409 DUPLICATE_RESOURCE, REJECTED에서 재-POST→201 재허용(재제출).
  //   x-mock-failure:apply→500 INTERNAL_SERVER_ERROR.
  //   x-mock-scenario:application-duplicate→409 강제(E2E "이미 신청" 재현용, 상태 무관).
  http.post(`${API_BASE_URL}/users/adjuster-applications`, async ({ request }) => {
    await delay(600);

    if (request.headers.get("x-mock-failure") === "apply") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "신청 처리 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    // E2E "409 이미 신청" 시나리오 강제 — 스테이트풀 상태(초기 404)로는 POST가 항상 201이라 재현 불가.
    // GET override 컨벤션(x-mock-scenario)과 동일하게 헤더로 중복 신청을 강제.
    if (request.headers.get("x-mock-scenario") === "application-duplicate") {
      return HttpResponse.json(
        { status: "409", code: "DUPLICATE_RESOURCE", message: "이미 신청되었거나 인증된 상태입니다." },
        { status: 409 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      name?: string;
      specialities?: string[];
      affiliation?: string;
      region?: string;
      registration_image_url?: string;
      license_no?: string | null;
      license_image_url?: string | null;
    };

    if (
      !body.name ||
      !body.specialities ||
      body.specialities.length === 0 ||
      !body.affiliation ||
      !body.region ||
      !body.registration_image_url
    ) {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "필수 입력값이 누락되었습니다." },
        { status: 400 },
      );
    }

    if (!body.license_no && !body.license_image_url) {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "자격증 번호 또는 사본 중 하나는 필수입니다." },
        { status: 400 },
      );
    }

    // 진행중(PENDING)·승인(APPROVED)이면 중복 신청. REJECTED·미신청이면 새 PENDING 생성(재제출 재허용).
    if (adjusterApplicationState && adjusterApplicationState.status !== "REJECTED") {
      return HttpResponse.json(
        { status: "409", code: "DUPLICATE_RESOURCE", message: "이미 신청되었거나 인증된 상태입니다." },
        { status: 409 },
      );
    }

    adjusterApplicationState = {
      applicationId: crypto.randomUUID(),
      status: "PENDING",
      submittedAt: new Date().toISOString(),
      name: body.name,
      // GET .../me 응답은 speciality 단수(명세) — 요청 specialities 배열의 첫 값을 보관.
      speciality: body.specialities[0] ?? "",
      licenseNo: body.license_no ?? null,
      documents: [
        { type: "LICENSE", status: "PENDING" },
        { type: "REGISTRATION", status: "PENDING" },
        { type: "ID_CARD", status: "PENDING" },
      ],
      rejectedAt: null,
      rejectReason: null,
    };

    return HttpResponse.json(
      {
        status: "201",
        message: "자격 인증 신청이 접수되었습니다.",
        data: camelToSnakeDeep({ applicationId: adjusterApplicationState.applicationId, status: "PENDING" }),
      },
      { status: 201 },
    );
  }),

  // 본인 자격 신청 상태 조회 (#44) — 미신청 404 POST_NOT_FOUND, 그 외 PENDING/APPROVED/REJECTED.
  //   시나리오 override: x-mock-scenario=application-(not-applied|pending|approved|rejected).
  //   x-mock-failure=application-unauthorized→401 LOGIN_REQUIRED / application-status→500.
  http.get(`${API_BASE_URL}/users/adjuster-applications/me`, async ({ request }) => {
    await delay(400);

    const failure = request.headers.get("x-mock-failure");
    if (failure === "application-unauthorized") {
      return HttpResponse.json(
        { status: "401", code: "LOGIN_REQUIRED", message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }
    if (failure === "application-status") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "신청 상태를 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    const scenario = request.headers.get("x-mock-scenario");
    if (scenario === "application-not-applied") {
      return HttpResponse.json(
        { status: "404", code: "POST_NOT_FOUND", message: "신청 이력이 없습니다." },
        { status: 404 },
      );
    }
    if (
      scenario === "application-pending" ||
      scenario === "application-approved" ||
      scenario === "application-rejected"
    ) {
      const status =
        scenario === "application-approved"
          ? "APPROVED"
          : scenario === "application-rejected"
            ? "REJECTED"
            : "PENDING";
      return HttpResponse.json({
        status: "200",
        message: "정상 처리되었습니다.",
        data: camelToSnakeDeep(buildAdjusterApplication(status)),
      });
    }

    if (!adjusterApplicationState) {
      return HttpResponse.json(
        { status: "404", code: "POST_NOT_FOUND", message: "신청 이력이 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep(adjusterApplicationState),
    });
  }),

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
    const source =
      request.headers.get("x-mock-empty") === "chat-list" ? [] : chatRooms;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({ rooms: source.map(toChatRoomDto) }),
    });
  }),

  // 채팅방 단건 조회 (이슈 #161) — 딥링크 진입용. 목록 응답 없이도 방 헤더 렌더.
  http.get(`${API_BASE_URL}/chats/:chatRoomId`, async ({ params }) => {
    await delay(300);

    const room = chatRooms.find(
      (r) => r.chatRoomId === String(params.chatRoomId),
    );
    if (!room) {
      return HttpResponse.json(
        { status: "404", code: "POST_NOT_FOUND", message: "채팅방을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep(toChatRoomDto(room)),
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
    const page = all.slice(start, end);
    // 더 오래된 페이지가 남아 있으면 이번 페이지 첫 메시지를 다음 커서로
    const hasNext = start > 0;
    const nextCursor = hasNext ? (page[0]?.messageId ?? null) : null;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({
        messages: page.map(toChatMessageDto),
        nextCursor,
        hasNext,
      }),
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

    // fetch-json이 요청 body를 snake로 변환 → { content, attachment: { attachment_key, name, content_type } }
    const body = (await request.json().catch(() => ({}))) as {
      content?: string;
      attachment?: {
        attachment_key?: string;
        name?: string;
        content_type?: string;
      };
    };
    const content = typeof body.content === "string" ? body.content : "";

    // 첨부는 업로드 응답 메타(key)를 전달받아 저장 url을 회수(없으면 key로 합성).
    let attachment: MockMessageAttachment | undefined;
    if (body.attachment?.attachment_key) {
      const key = body.attachment.attachment_key;
      const stored = uploadedChatAttachments.get(key);
      attachment = {
        url:
          stored?.url ??
          `https://mock.local/chat-uploads/${encodeURIComponent(key)}`,
        name: body.attachment.name ?? stored?.name ?? "첨부 파일",
        contentType:
          body.attachment.content_type ??
          stored?.contentType ??
          "application/octet-stream",
      };
    }

    if (!content && !attachment) {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "content 또는 attachment 중 하나는 필수입니다." },
        { status: 400 },
      );
    }

    const createdAt = new Date().toISOString();
    const messageId = crypto.randomUUID();

    (chatMessages[chatRoomId] ??= []).push({
      messageId,
      senderId: MOCK_ME_ID,
      content,
      createdAt,
      ...(attachment ? { attachment } : {}),
    });

    if (room) {
      room.lastMessage = content || `📎 ${attachment?.name ?? "첨부 파일"}`;
      room.lastMessageAt = createdAt;
      room.updatedAt = createdAt;
    }

    return HttpResponse.json(
      {
        status: "201",
        message: "전송되었습니다.",
        data: camelToSnakeDeep({
          messageId,
          chatRoomId,
          senderId: MOCK_ME_ID,
          messageType: deriveMessageType(attachment),
          content: content ? content : null,
          attachment: attachment ?? null,
          createdAt,
        }),
      },
      { status: 201 },
    );
  }),

  // 첨부 업로드 (POST /chats/{id}/attachments) — multipart file → key 메타 발급(private S3 가정).
  http.post(`${API_BASE_URL}/chats/:chatRoomId/attachments`, async ({ request, params }) => {
    await delay(500);

    const chatRoomId = String(params.chatRoomId);
    const room = chatRooms.find((r) => r.chatRoomId === chatRoomId);
    if (room?.roomStatus === "CLOSED") {
      return HttpResponse.json(
        { status: "409", code: "CLOSED", message: "종료된 상담입니다." },
        { status: 409 },
      );
    }

    const formData = await request.formData().catch(() => null);
    const entry = formData?.get("file");
    const file = entry && typeof entry !== "string" ? (entry as File) : null;

    // webkit 서비스워커는 multipart 파싱을 누락하는 경우가 있어 목 전용 헤더 폴백 사용
    const fallbackName = request.headers.get("x-mock-file-name");
    const fileName =
      file?.name || (fallbackName ? decodeURIComponent(fallbackName) : "");
    if (!fileName) {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "첨부 파일이 없습니다." },
        { status: 400 },
      );
    }
    const contentType =
      file?.type ||
      request.headers.get("x-mock-file-type") ||
      "application/octet-stream";

    // key 규칙: chat/{roomId}/{uuid}_{원본명}. 조회 url은 저장 후 GET/POST가 presigned로 내려준다.
    const attachmentKey = `chat/${chatRoomId}/${crypto.randomUUID()}_${fileName}`;
    const size = file?.size ?? 1024;
    uploadedChatAttachments.set(attachmentKey, {
      url: `https://mock.local/chat-uploads/${encodeURIComponent(attachmentKey)}`,
      name: fileName,
      contentType,
    });

    return HttpResponse.json(
      {
        status: "201",
        message: "업로드되었습니다.",
        data: camelToSnakeDeep({ attachmentKey, name: fileName, contentType, size }),
      },
      { status: 201 },
    );
  }),

  // 상담 수락 (PATCH /chats/{id}/accept) — 내 제안 ACCEPTED·방 CLOSED·형제 방 REJECTED+CLOSED·리포트 CLOSED.
  http.patch(`${API_BASE_URL}/chats/:chatRoomId/accept`, async ({ params }) => {
    await delay(300);

    const chatRoomId = String(params.chatRoomId);
    const room = chatRooms.find((r) => r.chatRoomId === chatRoomId);
    if (!room) {
      return HttpResponse.json(
        { status: "404", code: "POST_NOT_FOUND", message: "채팅방을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    // 파이프라인(report_review) 방·COUNSELING만 수락 가능. 그 외 409.
    if (room.matchStatus !== "COUNSELING") {
      return HttpResponse.json(
        { status: "409", code: "UNSUPPORTED_OPERATION", message: "이미 결정된 상담입니다." },
        { status: 409 },
      );
    }

    room.matchStatus = "ACCEPTED";
    room.roomStatus = "CLOSED";
    // 형제 방(같은 리포트) 자동 종료 — 서버 캐스케이드 미러.
    chatRooms
      .filter((r) => r.reportId === room.reportId && r.chatRoomId !== room.chatRoomId)
      .forEach((r) => {
        r.matchStatus = "REJECTED";
        r.roomStatus = "CLOSED";
      });

    return HttpResponse.json({
      status: "200",
      message: "상담을 수락했습니다.",
      data: camelToSnakeDeep({
        chatRoomId,
        chatRoomStatus: "CLOSED",
        reviewStatus: "ACCEPTED",
        reportId: room.reportId,
        reportStatus: "CLOSED",
      }),
    });
  }),

  // 상담 거절 (PATCH /chats/{id}/reject) — 내 제안 REJECTED·방 CLOSED·리포트 AWAITING_ADOPTION. 형제 유지.
  http.patch(`${API_BASE_URL}/chats/:chatRoomId/reject`, async ({ params }) => {
    await delay(300);

    const chatRoomId = String(params.chatRoomId);
    const room = chatRooms.find((r) => r.chatRoomId === chatRoomId);
    if (!room) {
      return HttpResponse.json(
        { status: "404", code: "POST_NOT_FOUND", message: "채팅방을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    if (room.matchStatus !== "COUNSELING") {
      return HttpResponse.json(
        { status: "409", code: "UNSUPPORTED_OPERATION", message: "이미 결정된 상담입니다." },
        { status: 409 },
      );
    }

    room.matchStatus = "REJECTED";
    room.roomStatus = "CLOSED";

    return HttpResponse.json({
      status: "200",
      message: "상담을 거절했습니다.",
      data: camelToSnakeDeep({
        chatRoomId,
        chatRoomStatus: "CLOSED",
        reviewStatus: "REJECTED",
        reportId: room.reportId,
        reportStatus: "AWAITING_ADOPTION",
      }),
    });
  }),

  // 읽음 처리 (POST /chats/{id}/read) — unread_count 0으로 리셋.
  http.post(`${API_BASE_URL}/chats/:chatRoomId/read`, async ({ params }) => {
    await delay(150);

    const chatRoomId = String(params.chatRoomId);
    const room = chatRooms.find((r) => r.chatRoomId === chatRoomId);
    if (!room) {
      return HttpResponse.json(
        { status: "404", code: "POST_NOT_FOUND", message: "채팅방을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    room.unreadCount = 0;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({ chatRoomId, readAt: new Date().toISOString() }),
    });
  }),

  // OAuth 소셜 로그인 콜백 (#40). 기본 성공(기존 회원).
  //  - code=new            → isNewUser:true (회원가입 플로우 분기)
  //  - code=fail-invalid   → 400 INVALID_REQUEST     (브라우저 URL 주입 — E2E)
  //  - code=fail-unsupported → 400 UNSUPPORTED_PROVIDER (브라우저 URL 주입 — E2E)
  //  - code=fail-external  → 500 EXTERNAL_API_ERROR   (브라우저 URL 주입 — E2E)
  //  - x-mock-failure 헤더 → invalid / unsupported / 그 외: 위와 동일(서버측 주입, 유지)
  //  콜백 페이지가 URL 쿼리 code를 그대로 전달하므로 E2E는 URL만으로 실패 결정 주입 가능.
  http.get(`${API_BASE_URL}/auth/oauth2/:provider/callback`, async ({ request, params }) => {
    await delay(600);

    const provider = String(params.provider);
    const url = new URL(request.url, "http://localhost");
    const code = url.searchParams.get("code");
    const failure = request.headers.get("x-mock-failure");

    if (provider !== "kakao" && provider !== "naver") {
      return HttpResponse.json(
        { status: "400", code: "UNSUPPORTED_PROVIDER", message: "지원하지 않는 소셜 로그인입니다." },
        { status: 400 },
      );
    }

    if (failure === "invalid" || code === "fail-invalid" || !code) {
      return HttpResponse.json(
        { status: "400", code: "INVALID_REQUEST", message: "유효하지 않은 인가 코드입니다." },
        { status: 400 },
      );
    }
    if (failure === "unsupported" || code === "fail-unsupported") {
      return HttpResponse.json(
        { status: "400", code: "UNSUPPORTED_PROVIDER", message: "지원하지 않는 소셜 로그인입니다." },
        { status: 400 },
      );
    }
    if (failure || code === "fail-external") {
      return HttpResponse.json(
        { status: "500", code: "EXTERNAL_API_ERROR", message: "소셜 로그인 연동에 실패했습니다." },
        { status: 500 },
      );
    }

    const isNewUser = code === "new";
    return HttpResponse.json({
      status: "200",
      message: "로그인 성공",
      // 응답 필드 snake_case(명세): user_id·is_new_user·signup_ticket·previously_withdrawn.
      data: camelToSnakeDeep(
        isNewUser
          ? {
              userId: null,
              isNewUser: true,
              signupTicket: `mock-signup-ticket-${crypto.randomUUID()}`,
              previouslyWithdrawn: false,
            }
          : { userId: crypto.randomUUID(), isNewUser: false, signupTicket: null, previouslyWithdrawn: false },
      ),
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

  // 알림 개별 읽음 처리 (#162, 스웨거 확정) — 대상 isRead 갱신, 없는 id는 404 봉투.
  http.patch(
    `${API_BASE_URL}/users/me/notifications/:notificationId/read`,
    async ({ request, params }) => {
      await delay(400);

      if (request.headers.get("x-mock-failure") === "notification-read") {
        return HttpResponse.json(
          { status: "500", code: "INTERNAL_SERVER_ERROR", message: "읽음 처리에 실패했습니다." },
          { status: 500 },
        );
      }

      const notification = NOTIFICATIONS.find((n) => n.id === params.notificationId);
      if (!notification) {
        return HttpResponse.json(
          { status: "404", code: "POST_NOT_FOUND", message: "알림을 찾을 수 없습니다." },
          { status: 404 },
        );
      }

      notification.isRead = true;

      return HttpResponse.json({
        status: "200",
        message: "정상 처리되었습니다.",
        data: null,
      });
    },
  ),

  // 내 알림 목록 (#49, 명세 Done) — items+unread_count+페이지네이션. read-all 반영된 isRead 상태 그대로 반환.
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
      data: camelToSnakeDeep({
        items: NOTIFICATIONS,
        unreadCount: NOTIFICATIONS.filter((n) => !n.isRead).length,
        page: 0,
        size: 20,
        totalElements: NOTIFICATIONS.length,
        totalPages: 1,
      }),
    });
  }),

  // 회원가입 (#43, 명세 2026-07-09 개정) — 전역 봉투 거울. 성공 201.
  // 토큰은 HttpOnly 쿠키(Set-Cookie access_token 30분/refresh_token 14일)로만 내려가고 body엔 없음 → data = { user_id, nickname, role }.
  // birth_date·phone_number·gender는 폼 확정(2026-07-21)으로 미전송 — 목도 검증하지 않는다(백엔드 완화 확인 대기).
  // 에러 재현: nickname "중복닉네임"→409 DUPLICATE_RESOURCE, 1자 미만·30자 초과→400 VALIDATION_ERROR,
  //   provider/socialToken/userType 누락→400 MISSING_REQUIRED_FIELD, x-mock-failure:social→500 EXTERNAL_API_ERROR.
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    await delay(600);

    const body = (await request.json().catch(() => ({}))) as {
      provider?: string;
      social_token?: string;
      nickname?: string;
      user_type?: string;
    };

    if (request.headers.get("x-mock-failure") === "social") {
      return HttpResponse.json(
        { status: "500", code: "EXTERNAL_API_ERROR", message: "소셜 인증에 실패했습니다. 다시 시도해 주세요." },
        { status: 500 },
      );
    }

    if (!body.provider || !body.social_token || !body.user_type) {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "필수 입력값이 누락되었습니다." },
        { status: 400 },
      );
    }

    if (!body.nickname || body.nickname.length < 1 || body.nickname.length > 30) {
      return HttpResponse.json(
        { status: "400", code: "VALIDATION_ERROR", message: "이름은 1~30자로 입력해 주세요." },
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
        // 응답 역할은 명세대로 role(요청 user_type 매핑: adjuster→UNCERTIFICATED_ADJUSTER, 그 외→USER)
        data: camelToSnakeDeep({
          userId: crypto.randomUUID(),
          nickname: body.nickname,
          role: body.user_type === "adjuster" ? "UNCERTIFICATED_ADJUSTER" : "USER",
        }),
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

  // 손해사정사 홈 대시보드 집계 (BFF, #30/#130) — GET /adjusters/me/home.
  // 기존 /dashboard·/in-progress·/profile-summary 3분할을 1콜로 통합. in_progress_limit(기본 5, 최대 20) 잘라 반환.
  http.get(`${API_BASE_URL}/adjusters/me/home`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "home") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "대시보드를 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    const url = new URL(request.url, "http://localhost");
    const limit = Math.min(
      20,
      Math.max(1, Number(url.searchParams.get("in_progress_limit") ?? "5") || 5),
    );

    const inProgressItems = [
      {
        reportId: "c1000000-0000-4000-8000-000000000022",
        caseNo: "20260528-022",
        accidentType: "후유장해",
        title: "장해등급 재산정 의견 작성 중",
        reportStatus: "AWAITING_INSPECTION",
        reviewStatus: null,
        stageLabel: "검수 중",
        progressPercent: 65,
      },
      {
        reportId: "c1000000-0000-4000-8000-000000000019",
        caseNo: "20260527-019",
        accidentType: "교통사고",
        title: "검수 완료 · 고객 상담 대기",
        reportStatus: "AWAITING_ADOPTION",
        reviewStatus: "SENT",
        stageLabel: "고객 검토",
        progressPercent: 100,
      },
    ];

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({
        adjuster: {
          id: "11111111-1111-4111-8111-111111111111",
          name: "김상정",
          avatarUrl: null,
        },
        summary: {
          pendingCount: 4,
          pendingNewCount: 2,
          inProgressCount: 2,
          monthlyCompletedCount: 14,
          totalCompletedCount: 240,
          consultationConvertedCount: 9,
          rating: { average: 4.9, reviewCount: 86 },
        },
        inProgressCases: {
          total: inProgressItems.length,
          items: inProgressItems.slice(0, limit),
        },
      }),
    });
  }),

  // 손해사정사 마이페이지 집계 (이슈 #46)
  http.get(`${API_BASE_URL}/adjusters/me/mypage`, async ({ request }) => {
    await delay(500);

    if (isLoggedOut()) {
      return HttpResponse.json(
        { status: "401", code: "LOGIN_REQUIRED", message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

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
      data: camelToSnakeDeep({ ...NOTIFICATION_SETTINGS }),
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
      const wireKey = toSnakeKey(key);
      if (typeof body[wireKey] === "boolean") {
        NOTIFICATION_SETTINGS[key] = body[wireKey];
      }
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({ ...NOTIFICATION_SETTINGS }),
    });
  }),

  // 활동 카운트 (이슈 #105) — CONTRACT(명세없음-임시): GET /users/me/activity-summary
  http.get(`${API_BASE_URL}/users/me/activity-summary`, async ({ request }) => {
    await delay(300);

    if (request.headers.get("x-mock-failure") === "activity-summary") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "활동 내역을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { ...ACTIVITY_SUMMARY },
    });
  }),

  // 내 보험 목록 (이슈 #105) — GET /users/me/insurances (확정 스펙)
  // x-mock-scenario=insurances-empty → 0건 빈 상태 검증.
  http.get(`${API_BASE_URL}/users/me/insurances`, async ({ request }) => {
    await delay(300);

    if (request.headers.get("x-mock-failure") === "insurances") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "보험 목록을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    const list =
      request.headers.get("x-mock-scenario") === "insurances-empty"
        ? []
        : MOCK_INSURANCES.map((item) => ({ ...item }));

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { list },
    });
  }),

  // 내 보험 추가 (이슈 #105) — POST /users/me/insurances (확정 스펙): 201 + data는 생성 id 단건.
  http.post(`${API_BASE_URL}/users/me/insurances`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "add-insurance") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "보험을 추가하지 못했습니다." },
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

    if (typeof body.insurer_name !== "string" || typeof body.product_name !== "string") {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "보험사·상품명을 입력해 주세요." },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    MOCK_INSURANCES.push({
      id,
      insurerName: body.insurer_name,
      productName: body.product_name,
      policyNo: typeof body.policy_no === "string" ? body.policy_no : null,
      enrolledAt: typeof body.enrolled_at === "string" ? body.enrolled_at : null,
      coverages: Array.isArray(body.coverages) ? body.coverages : [],
      // CONTRACT(직접 입력 시 초기 matchStatus 백엔드 확인 필요): 서버가 즉시 fuzzy 매칭하는지 비동기 대기인지 미확정 → 대기(PENDING)로 둔다.
      matchStatus: "PENDING",
      // CONTRACT(확장 등재 요청 중, 이슈 #105): GET list 미등재 필드. 증권 업로드 없이 직접 입력 → 미등록.
      policyFileUrl: typeof body.policy_file_url === "string" ? body.policy_file_url : null,
    });

    // 확정 응답: 201 + data는 생성 id 하나뿐(전체 객체 아님). 목록은 훅이 invalidate로 재조회한다.
    return HttpResponse.json(
      { status: "201", message: "등록되었습니다.", data: { id } },
      { status: 201 },
    );
  }),

  // 액세스 토큰 재발급 (#109) — refresh_token HttpOnly 쿠키만 사용(바디·Authorization 없음), data는 null.
  // E2E 주입: localStorage["mock:tokenExpired"]="once"(재발급 성공) | "refresh-expired"(재발급 실패).
  // 실제 호출 횟수는 localStorage["mock:reissueCount"]에 누적 — 동시 401 다발 시 단일-flight 검증용.
  http.post(`${API_BASE_URL}/auth/reissue`, async () => {
    await delay(200);

    const outcome = consumeReissue();
    if (outcome === "success") {
      return HttpResponse.json({
        status: "200",
        message: "정상 처리되었습니다.",
        data: null,
      });
    }

    return HttpResponse.json(
      {
        status: "401",
        code: outcome,
        message:
          outcome === "EXPIRED_TOKEN"
            ? "리프레시 토큰이 만료되었습니다."
            : "로그인이 필요합니다.",
      },
      { status: 401 },
    );
  }),

  // 로그아웃 (#155) — refresh_token HttpOnly 쿠키 무효화. 바디 없음, data는 null.
  // 성공 시 로그아웃 상태를 기록해 이후 보호 엔드포인트가 401 LOGIN_REQUIRED를 돌려준다.
  // E2E 실패 주입: x-mock-failure=logout → 500(서버 실패에도 클라이언트 정리·이동 검증용, 세션은 유지).
  http.post(`${API_BASE_URL}/auth/logout`, async ({ request }) => {
    await delay(200);

    if (request.headers.get("x-mock-failure") === "logout") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "로그아웃을 처리하지 못했습니다." },
        { status: 500 },
      );
    }

    setLoggedOut();
    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: null,
    });
  }),

  // 본인 정보 조회 (고객 대시보드 인사말)
  // E2E 역할 게이팅 검증용: localStorage["mock:userType"]="adjuster"면 사정사로 응답(기본 insured_person).
  http.get(`${API_BASE_URL}/users/me`, async ({ request }) => {
    await delay(300);
    // 비로그인 시나리오 주입 — E2E 랜딩(온보딩) 검증용. 기본은 로그인 유저(변경 없음).
    if (request.headers.get("x-mock-scenario") === "unauthenticated" || isLoggedOut()) {
      return HttpResponse.json(
        { status: "401", code: "LOGIN_REQUIRED", message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }
    // 액세스 토큰 만료 주입 (#109) — 재발급 성공 시 플래그가 해제돼 이후 호출은 200.
    if (isAccessTokenExpired()) {
      return HttpResponse.json(
        { status: "401", code: "EXPIRED_TOKEN", message: "토큰이 만료되었습니다." },
        { status: 401 },
      );
    }
    // 조회 실패 주입 — E2E 로그인 가드 검증용(실패 시 로그인 화면 유지).
    if (request.headers.get("x-mock-failure") === "me") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "사용자 정보를 불러오지 못했습니다." },
        { status: 500 },
      );
    }
    // 응답에 userType이 없다(FE가 role에서 파생). mock:userType override는 resolveMockRole이 role로 매핑한다.
    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { ...MOCK_ME, role: resolveMockRole() },
    });
  }),

  // 본인 정보 수정 — PATCH /users/me (확정 스펙 2026-07-14). body(하나 이상): phone_number·region[]·avatar_url.
  // 응답은 명세대로 me 전체 객체(snake). FE는 응답을 폐기하고 GET 재조회로 갱신한다.
  http.patch(`${API_BASE_URL}/users/me`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "update-me") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "프로필을 저장하지 못했습니다." },
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

    // 요청 body는 이미 snake_case(fetch-json 변환). 명세 허용 필드만 머지.
    for (const key of ["phone_number", "region", "avatar_url"] as const) {
      if (key in body) MOCK_ME[key] = body[key];
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { ...MOCK_ME, role: resolveMockRole() },
    });
  }),

  // 고객 홈 대시보드 BFF (이슈 #142) — GET /users/me/dashboard. 🏷 백엔드 확정 대기.
  //   x-mock-scenario=unauthenticated → 401 LOGIN_REQUIRED.
  //   x-mock-scenario=dashboard-onboarding → report_count 0(온보딩 분기), 나머지 null/0.
  //   x-mock-scenario=dashboard-inspecting → 검수 중(제안 0건): activeReport AWAITING_INSPECTION·firstReviewedAt null, proposalSummary null(제안 비교 숨김), todos 0.
  //   x-mock-scenario=dashboard-closed → 전부 종료: activeReport·proposalSummary null(타임라인·제안 비교 숨김), todos 0. reportCount>0라 온보딩 아님.
  http.get(`${API_BASE_URL}/users/me/dashboard`, async ({ request }) => {
    await delay(400);

    if (request.headers.get("x-mock-scenario") === "unauthenticated" || isLoggedOut()) {
      return HttpResponse.json(
        { status: "401", code: "LOGIN_REQUIRED", message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    if (request.headers.get("x-mock-scenario") === "dashboard-onboarding") {
      return HttpResponse.json({
        status: "200",
        message: "정상 처리되었습니다.",
        data: camelToSnakeDeep({
          reportCount: 0,
          activeReport: null,
          proposalSummary: null,
          todos: { unreadProposalCount: 0, unreadReviewCompleteCount: 0, unreadChat: null },
        }),
      });
    }

    if (request.headers.get("x-mock-scenario") === "dashboard-inspecting") {
      return HttpResponse.json({
        status: "200",
        message: "정상 처리되었습니다.",
        data: camelToSnakeDeep({
          reportCount: 3,
          activeReport: {
            reportId: DASHBOARD_AWAITING_REPORT_ID,
            title: "발목 인대 손상",
            accidentType: "medical_indemnity",
            status: "AWAITING_INSPECTION",
            createdAt: "2026-07-18T09:00:00Z",
            firstReviewedAt: null,
            proposalCount: 0,
          },
          proposalSummary: null,
          todos: { unreadProposalCount: 0, unreadReviewCompleteCount: 0, unreadChat: null },
        }),
      });
    }

    if (request.headers.get("x-mock-scenario") === "dashboard-closed") {
      return HttpResponse.json({
        status: "200",
        message: "정상 처리되었습니다.",
        data: camelToSnakeDeep({
          reportCount: 3,
          activeReport: null,
          proposalSummary: null,
          todos: { unreadProposalCount: 0, unreadReviewCompleteCount: 0, unreadChat: null },
        }),
      });
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep(DASHBOARD_MOCK),
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
        reportId: DASHBOARD_PROPOSABLE_REPORT_ID,
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

  // 고객 리포트 목록 (대시보드 + 내 리포트 목록) — :reportId·pending-review와 충돌 없게 정확 경로.
  // §9 드리프트 필드 선반영(reportNo·claimedMin/Max·proposalCount·reviewedAt·adjusterNickname).
  http.get(`${API_BASE_URL}/reports`, async ({ request }) => {
    await delay(400);

    const url = new URL(request.url, "http://localhost");
    // page 파라미터 유무로 소비처 분기:
    //  - 없음: 대시보드(useReportList) — 전체 목록 1페이지, 기존 2건 그대로(집계·E2E 불변).
    //  - 있음: 내 리포트 목록(useReportListInfinite) — page/size 페이지네이션(1-based).
    const rawPage = url.searchParams.get("page");
    const isPaged = rawPage !== null;
    const page = Number(rawPage ?? "1");
    // 무한 목록 기본 size는 5 — 목 8건이 2페이지(5+3)로 나뉘어 더보기·hasNext를 실사용처럼 검증.
    const size = Number(url.searchParams.get("size") ?? (isPaged ? "5" : "10"));

    // 빈 상태(0건) 주입 — E2E 빈 상태 검증용(x-mock-failure 패턴 미러)
    if (request.headers.get("x-mock-scenario") === "reports-empty") {
      return HttpResponse.json({
        status: "200",
        message: "정상 처리되었습니다.",
        data: camelToSnakeDeep({
          list: [],
          pagination: { page, size, totalElements: 0, totalPages: 0, hasNext: false },
        }),
      });
    }

    // 액세스 토큰 만료 주입 (#109) — /users/me와 동시에 401을 받게 해 단일-flight 재발급을 검증한다.
    if (isAccessTokenExpired()) {
      return HttpResponse.json(
        { status: "401", code: "EXPIRED_TOKEN", message: "토큰이 만료되었습니다." },
        { status: 401 },
      );
    }

    // page 미지정(대시보드): 기존 응답 그대로 — 2건·hasNext:false·totalPages:1.
    if (!isPaged) {
      return HttpResponse.json({
        status: "200",
        message: "정상 처리되었습니다.",
        data: camelToSnakeDeep({
          list: HEAD_REPORTS,
          pagination: {
            page: 1,
            size,
            totalElements: HEAD_REPORTS.length,
            totalPages: 1,
            hasNext: false,
          },
        }),
      });
    }

    const start = (page - 1) * size;
    const paged = REPORT_LIST_SOURCE.slice(start, start + size);
    const totalPages = Math.max(1, Math.ceil(REPORT_LIST_SOURCE.length / size));

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({
        list: paged,
        pagination: {
          page,
          size,
          totalElements: REPORT_LIST_SOURCE.length,
          totalPages,
          hasNext: start + size < REPORT_LIST_SOURCE.length,
        },
      }),
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
      const wireKey = toSnakeKey(field);
      if (wireKey in body) ADJUSTER_PROFILE[field] = body[wireKey];
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
    // 요청 body는 fetchJson이 camel→snake 변환해 보냄 — 명세 필드명 그대로 읽는다.
    const body = (await request.json()) as {
      accident_type?: string;
      documents?: Array<{
        s3_url?: string;
        name?: string;
        report_type?: string;
        file_type?: string;
      }>;
    };

    if (body.accident_type !== "medical_indemnity") {
      return HttpResponse.json(
        { status: "400", code: "UNSUPPORTED_OPERATION", message: "현재 실손 의료비만 분석 가능합니다." },
        { status: 400 },
      );
    }

    // documents는 선택이나, 있으면 각 항목의 s3_url·name·report_type은 필수(명세 Document).
    if (
      Array.isArray(body.documents) &&
      body.documents.some((doc) => !doc?.s3_url || !doc?.name || !doc?.report_type)
    ) {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "문서 메타(s3_url·name·report_type)가 누락되었습니다." },
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

  // 검수 보류 (PC 프리뷰 패널) — POST + reason 필수(멱등). OTHER면 reason_detail 필수.
  http.post(`${API_BASE_URL}/reports/:reportId/hold`, async ({ request, params }) => {
    await delay(300);

    const reportId = typeof params.reportId === "string" ? params.reportId : "";
    const target = PENDING_REVIEWS.find((review) => review.reportId === reportId);
    if (!target) {
      return HttpResponse.json(
        { status: "404", code: "REPORT_NOT_FOUND", message: "리포트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      reason?: string;
      reason_detail?: string | null;
    };
    const REASONS = ["NEED_MORE_DOCUMENTS", "OUT_OF_SPECIALTY", "SCHEDULE_CONFLICT", "OTHER"];
    if (!body.reason) {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "보류 사유를 선택해 주세요." },
        { status: 400 },
      );
    }
    if (!REASONS.includes(body.reason)) {
      return HttpResponse.json(
        { status: "400", code: "VALIDATION_ERROR", message: "허용되지 않는 보류 사유입니다." },
        { status: 400 },
      );
    }
    if (body.reason === "OTHER" && !body.reason_detail) {
      return HttpResponse.json(
        { status: "400", code: "MISSING_REQUIRED_FIELD", message: "기타 사유를 입력해 주세요." },
        { status: 400 },
      );
    }

    target.held = true;
    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        report_id: reportId,
        held: true,
        reason: body.reason,
        reason_detail: body.reason_detail ?? null,
      },
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
    const page = Number(url.searchParams.get("page") ?? "0"); // 명세: page는 0부터
    const size = Number(url.searchParams.get("size") ?? "20"); // 명세 기본 20

    // 검수 이력 자체 없음(no-data) 시나리오
    const emptyAll = request.headers.get("x-mock-reviewed") === "empty";
    const source = emptyAll ? [] : REVIEWED_REPORTS;

    const filtered =
      !status || status === "ALL"
        ? source
        : source.filter((r) => r.status === status);

    const start = page * size;
    const paged = filtered.slice(start, start + size);
    const totalPages = Math.max(1, Math.ceil(filtered.length / size));

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      // 페이지 메타는 명세대로 data 최상위 평면(pagination 객체·has_next 없음).
      data: camelToSnakeDeep({
        stats: {
          monthlyReviewCount: emptyAll ? 0 : 18,
          previousMonthReviewCount: emptyAll ? 0 : 15,
          // 상담 전환 티켓 미구현 — 현재 항상 0(0.0~1.0 비율).
          consultationConvertedCount: 0,
          consultationConversionRate: 0,
          totalCount: source.length,
        },
        items: paged,
        page,
        size,
        totalElements: filtered.length,
        totalPages,
      }),
    });
  }),

  // 받은 제안 목록 조회 (이슈 #18/#48) — 리포트 ①은 채팅방(chatRooms)을 원천으로 동기화.
  //   같은 proposalId·status를 노출해 채팅↔proposals 정합 유지.
  //   그 외 리포트는 proposal_count와 맞춘 고정 제안 목(EXTRA_PROPOSALS)에서 반환 (이슈 #153).
  //   REJECTED 제안은 목록에서 제외(받은제안 카드 UX: 거절 시 제거. ⚠️ 노출 정책 백엔드 확인 중 — TEMP §5-3).
  http.get(`${API_BASE_URL}/reports/:reportId/proposals`, async ({ params }) => {
    await delay(500);

    const reportId = typeof params.reportId === "string" ? params.reportId : "";
    const list =
      reportId === DASHBOARD_PROPOSABLE_REPORT_ID
        ? chatRooms
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
            })
        : EXTRA_PROPOSALS.filter(
            (proposal) => proposal.reportId === reportId && proposal.status !== "REJECTED",
          ).map(({ reportId: _reportId, ...proposal }) => proposal);

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({
        target: PROPOSAL_TARGETS[reportId],
        list,
        pagination: {
          page: 1,
          size: 10,
          totalElements: list.length,
          totalPages: 1,
          hasNext: false,
        },
      }),
    });
  }),

  // 제안 매칭(채택·거절) 통합 (이슈 #48) — PATCH /reports/:reportId/proposals/:proposalId {status}.
  //   ACCEPTED: 대상 방 매칭완료 + 형제(같은 reportId) 방 자동종료(REJECTED·CLOSED) 캐스케이드.
  //   REJECTED: 대상 방만 종료. 이미 확정된 방 재PATCH → 409.
  //   x-mock-failure:match-proposal → 500 INTERNAL_SERVER_ERROR (실패 토스트 E2E용).
  http.patch(
    `${API_BASE_URL}/reports/:reportId/proposals/:proposalId`,
    async ({ request, params }) => {
      await delay(400);

      if (request.headers.get("x-mock-failure") === "match-proposal") {
        return HttpResponse.json(
          {
            status: "500",
            code: "INTERNAL_SERVER_ERROR",
            message: "서버 오류가 발생했습니다.",
          },
          { status: 500 },
        );
      }

      const reportId = typeof params.reportId === "string" ? params.reportId : "";
      const proposalId =
        typeof params.proposalId === "string" ? params.proposalId : "";
      const body = (await request.json().catch(() => ({}))) as {
        status?: string;
      };
      const status = body.status === "ACCEPTED" ? "ACCEPTED" : "REJECTED";

      const target = chatRooms.find((room) => room.proposalId === proposalId);
      if (!target) {
        // 고정 제안 목(EXTRA_PROPOSALS)도 같은 전이 규칙 적용 (이슈 #153) — 채팅방 캐스케이드만 없음.
        const extra = EXTRA_PROPOSALS.find((proposal) => proposal.proposalId === proposalId);
        if (!extra) {
          return HttpResponse.json(
            { status: "404", code: "POST_NOT_FOUND", message: "제안을 찾을 수 없습니다." },
            { status: 404 },
          );
        }
        if (extra.status === "ACCEPTED" || extra.status === "REJECTED") {
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
          extra.status = "ACCEPTED";
          EXTRA_PROPOSALS.filter(
            (proposal) =>
              proposal.reportId === extra.reportId && proposal.proposalId !== proposalId,
          ).forEach((proposal) => {
            proposal.status = "REJECTED";
          });

          return HttpResponse.json({
            status: "200",
            message: "매칭이 완료되었습니다.",
            data: camelToSnakeDeep({
              reportId,
              proposalId,
              adjusterId: extra.adjusterId,
              reportStatus: "CLOSED",
              reviewStatus: "ACCEPTED",
            }),
          });
        }

        extra.status = "REJECTED";

        return HttpResponse.json({
          status: "200",
          message: "제안을 거절했습니다.",
          data: camelToSnakeDeep({
            reportId,
            proposalId,
            adjusterId: extra.adjusterId,
            reportStatus: "AWAITING_ADOPTION",
            reviewStatus: "REJECTED",
          }),
        });
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
          data: camelToSnakeDeep({
            reportId,
            proposalId,
            adjusterId: target.adjusterId,
            reportStatus: "CLOSED",
            reviewStatus: "ACCEPTED",
          }),
        });
      }

      target.matchStatus = "REJECTED";
      target.roomStatus = "CLOSED";

      return HttpResponse.json({
        status: "200",
        message: "제안을 거절했습니다.",
        data: camelToSnakeDeep({
          reportId,
          proposalId,
          adjusterId: target.adjusterId,
          reportStatus: "AWAITING_ADOPTION",
          reviewStatus: "REJECTED",
        }),
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
      // ⚠️ 임시 계약 — region 전송 포맷은 백엔드 미확정.
      // 현재는 지역 라벨을 콤마로 이은 값("서울 강남구,경기 성남시")을 거울로 모킹한다. 한 곳이라도 맞으면 통과.
      const labels = region.split(",").map((label) => label.trim()).filter(Boolean);
      result = result.filter((a) =>
        labels.some((label) => {
          // "서울 전체"·"서울"은 시·도 단위, "서울 강남구"는 시·군·구까지 맞아야 한다.
          const [sido = "", district] = label.split(" ");
          if (!district || district === "전체") return a.activityRegion.includes(sido);
          return a.activityRegion.includes(label);
        }),
      );
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

  // 검수 화면 조회 (손해사정사) — GET /reports/{reportId}/review. :reportId GET보다 먼저 등록.
  // started=false면 adjuster_estimate·review·review_status는 null(작업본 미생성).
  // x-mock-scenario: review-started(작업본 있음) / review-not-found(404).
  http.get(`${API_BASE_URL}/reports/:reportId/review`, async ({ request, params }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "review-detail") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "검수 정보를 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    const rawReportId = typeof params.reportId === "string" ? params.reportId : "";
    if (request.headers.get("x-mock-scenario") === "review-not-found") {
      return HttpResponse.json(
        { status: "404", code: "REPORT_NOT_FOUND", message: "리포트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawReportId);
    const reportId = isUuid ? rawReportId : crypto.randomUUID();
    const started = request.headers.get("x-mock-scenario") === "review-started";

    const issues = [
      {
        issueId: "a0000000-0000-4000-8000-000000000001",
        reviewIssueId: started ? "b0000000-0000-4000-8000-000000000001" : null,
        aiTitle: "후유장해 등급 재산정",
        aiDescription:
          "AI 초안은 14급으로 추정했으나, 관절 운동범위 제한 정도를 고려하면 12급 적용 여지가 있습니다.",
        aiStatus: "TRUSTED",
        tags: ["약관 제12조", "분쟁조정 2023-1456"],
        impactAmount: 3_500_000,
        reviewStatus: started ? "MODIFIED" : null,
        adjusterOpinion: started ? "운동범위 측정치 기준 12급 적용이 타당합니다." : null,
        modifiedTitle: started ? "후유장해 12급 재산정" : null,
        modifiedDescription: started ? "AMA 기준 재적용 시 12급." : null,
        modifiedImpactAmount: started ? 5_200_000 : null,
        modifiedReason: started ? "장해등급 상향" : null,
        excludedReason: null,
      },
      {
        issueId: "a0000000-0000-4000-8000-000000000002",
        reviewIssueId: started ? "b0000000-0000-4000-8000-000000000002" : null,
        aiTitle: "입원 일당 미반영분",
        aiDescription: "입원 17일 중 초안에 14일만 반영되어 3일분 누락 추정.",
        aiStatus: "CONFIRMED",
        tags: ["특약 제5조"],
        impactAmount: 600_000,
        reviewStatus: started ? "ACCEPTED" : null,
        adjusterOpinion: null,
        modifiedTitle: null,
        modifiedDescription: null,
        modifiedImpactAmount: null,
        modifiedReason: null,
        excludedReason: null,
      },
      {
        issueId: "a0000000-0000-4000-8000-000000000003",
        reviewIssueId: started ? "b0000000-0000-4000-8000-000000000003" : null,
        aiTitle: "외모변형 장해 특약 적용",
        aiDescription: "수술 흉터 관련 외모변형 장해 특약 청구 가능성 검토 항목.",
        aiStatus: "INFO",
        tags: ["외모변형 장해특약"],
        impactAmount: null,
        reviewStatus: started ? "EXCLUDED" : null,
        adjusterOpinion: null,
        modifiedTitle: null,
        modifiedDescription: null,
        modifiedImpactAmount: null,
        modifiedReason: null,
        excludedReason: started ? "현 자료로는 외모변형 장해 기준 미충족." : null,
      },
    ];

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({
        reportId,
        caseNo: "20260520-017",
        title: "후유장해 · 우측 슬관절 후방십자인대 파열 등급 재산정",
        accidentType: "후유장해",
        region: "서울 강남",
        status: started ? "AWAITING_ADOPTION" : "AWAITING_INSPECTION",
        confidenceLevel: "HIGH",
        isMasked: true,
        offeredAmount: 8_500_000,
        client: {
          nickname: "윤O서",
          gender: "여",
          birthDate: "1991-04-12",
          region: "서울 강남",
          joinedAt: "2024-03-01",
        },
        claim: {
          accidentType: "후유장해",
          diagnosis: "우측 슬관절 후방십자인대 파열",
          accidentDate: "2026-05-01",
          hospitalization:
            "2026-05-02 ~ 2026-05-18 (후방십자인대 파열 수술) · 2026-06-10 ~ 2026-06-21 (재활 재입원)",
          description:
            "퇴근길 신호 대기 중 후방 추돌 사고를 당했습니다. 사고 직후 우측 무릎 통증과 부종이 심해 응급실에 내원했고, 정밀검사 결과 후방십자인대 파열 진단을 받아 입원 치료 후 수술을 받았습니다.",
          additionalInformation: null,
          productName: "행복드림 종합보험",
          insurerName: "OO손해보험",
        },
        attachments: [
          {
            attachmentId: "att-1",
            name: "진단서",
            mimeType: "application/pdf",
            url: "https://cdn.example.com/reports/att-1.pdf",
            reportType: "DIAGNOSIS",
            pageCount: 2,
            issuedBy: "강남세브란스병원",
            issuedAt: "2026-05-18",
            aiSummary:
              "우측 슬관절 후방십자인대 완전 파열, 관절경적 재건술 시행. 향후 장해 잔존 가능성 명시.",
          },
          {
            attachmentId: "att-2",
            name: "MRI 영상 판독지",
            mimeType: "application/pdf",
            url: "https://cdn.example.com/reports/att-2.pdf",
            reportType: "IMAGING",
            pageCount: 1,
            issuedBy: "강남세브란스병원 영상의학과",
            issuedAt: "2026-05-03",
            aiSummary: "후방십자인대 연속성 소실 확인, 동반 반월상연골 손상 의심.",
          },
          {
            attachmentId: "att-3",
            name: "입퇴원 확인서",
            mimeType: "image/jpeg",
            url: "https://cdn.example.com/reports/att-3.jpg",
            reportType: "ADMISSION",
            pageCount: null,
            issuedBy: "병원 발행",
            issuedAt: "2026-05-18",
            aiSummary: null,
          },
        ],
        aiEstimate: { min: 12_000_000, max: 18_000_000 },
        adjusterEstimate: started ? { min: 13_000_000, max: 19_000_000 } : null,
        applicableGuarantees: ["상해후유장해 담보", "골절 진단비 특약", "입원·통원 일당"],
        omittedSpecialContract: ["외모변형 장해특약"],
        basisTermsPrecedents: [
          "약관 제12조 (후유장해 보험금 산정기준)",
          "분쟁조정 2023-1456 (장해등급 재산정 인정 사례)",
          "대법원 2019다○○○○ (후유장해 인과관계 판단)",
        ],
        issues,
        review: started ? "장해율 재산정 필요, 청구 범위 상향 여지 있음." : null,
        reviewStatus: started ? "SENT" : null,
        started,
        progress: {
          total: 3,
          accepted: started ? 1 : 0,
          modified: started ? 1 : 0,
          excluded: started ? 1 : 0,
        },
      }),
    });
  }),

  // 리포트 상세 조회 (고객측 — issue: CONFIRMED/TRUSTED/INFO). 파트너 검수는 /review로 분리(#130).
  http.get(`${API_BASE_URL}/reports/:reportId`, async ({ params }) => {
    await delay(500);

    const reportId =
      typeof params.reportId === "string"
        ? params.reportId
        : crypto.randomUUID();

    // 리뷰 클릭스루용 안정 uuid — 상세→리뷰 작성 왕복 시 동일 CLOSED(종결) 응답 보장.
    const isCustomerSample =
      reportId === "test-id-123" || reportId === DASHBOARD_PROPOSABLE_REPORT_ID;

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId);
    const responseReportId = isUuid ? reportId : crypto.randomUUID();

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({
        reportId: responseReportId,
        status: isCustomerSample ? "CLOSED" : "AWAITING_INSPECTION",
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
        issues: [
          {
            issueId: "issue-1",
            title: "장해등급 과소 산정 가능",
            description: "현재 자료만으로는 12급 적용을 단정하기 어려워요.",
            aiStatus: "TRUSTED",
            impactAmount: 350,
            tags: ["약관 제12조", "분쟁조정 2023-1456"],
          },
          {
            issueId: "issue-2",
            title: "외모추상 특약 청구 누락",
            description: "누락분 청구 검토가 가장 확실한 출발점이에요.",
            aiStatus: "CONFIRMED",
            impactAmount: 200,
            tags: ["특약 약관 §4", "유사사례 1456"],
          },
          {
            issueId: "issue-3",
            title: "진행 방향",
            description: "추가 의료자료 확보 → 재산정 순서를 권해요.",
            aiStatus: "INFO",
            tags: ["분쟁조정 절차"],
          },
        ],
        question: "보험금이 적게 나온 것 같아요",
        confidenceLevel: "HIGH",
        caseNo: "20260520-017",
        adjusterId: isCustomerSample ? CUSTOMER_SAMPLE_ADJUSTER_ID : crypto.randomUUID(),
        reviewComment: isCustomerSample
          ? "누락된 청구 검토가 가능한 출발점입니다. 장해등급은 재검사 결과를 보고 판단하는 편이 안전합니다."
          : null,
        reviewedAt: isCustomerSample ? "2026.05.22" : null,
        adjuster: { nickname: "정우성", career: "12년 경력 손해사정사" },
      }),
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

    const reportId =
      typeof params.reportId === "string"
        ? params.reportId
        : crypto.randomUUID();

    // status는 서버가 파생(클라이언트 미전송). 작업본 최초 반영 시 review_status=SENT.
    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: camelToSnakeDeep({
        reportId,
        status: "AWAITING_ADOPTION",
        reportReviewId: crypto.randomUUID(),
        reviewStatus: "SENT",
      }),
    });
  }),
];
