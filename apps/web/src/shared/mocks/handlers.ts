import { delay, http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/shared/api/config";

// 검수 대기 목 데이터 — 보류 상태 반영 위해 모듈 스코프에 고정(reportId 안정)
const PENDING_REVIEWS = [
  { reportId: crypto.randomUUID(), accidentType: "후유장해", status: "AWAITING_INSPECTION", createdAt: "2026-06-19T09:00:00Z", caseId: "20260619-042", title: "우측 슬관절 후방십자인대 파열 · 등급 재산정 쟁점", region: "서울 강남", matchingScore: 96, claimedMinAmount: 12_000_000, claimedMaxAmount: 18_000_000, offerHeadroom: 5_500_000, issueCount: 2 },
  { reportId: crypto.randomUUID(), accidentType: "교통사고", status: "AWAITING_INSPECTION", createdAt: "2026-06-19T08:10:00Z", caseId: "20260619-041", title: "다발성 늑골 골절 · 일실수입 과소 산정 의심", region: "경기 성남", matchingScore: 91, claimedMinAmount: 24_000_000, claimedMaxAmount: 31_000_000, offerHeadroom: 6_000_000, issueCount: 3 },
  { reportId: crypto.randomUUID(), accidentType: "후유장해", status: "AWAITING_INSPECTION", createdAt: "2026-06-18T16:40:00Z", caseId: "20260618-030", title: "요추 추간판탈출 · 외모추상 특약 청구 누락", region: "서울 송파", matchingScore: 88, claimedMinAmount: 9_000_000, claimedMaxAmount: 14_000_000, offerHeadroom: 2_800_000, issueCount: 2 },
  { reportId: crypto.randomUUID(), accidentType: "실손", status: "AWAITING_INSPECTION", createdAt: "2026-06-18T11:20:00Z", caseId: "20260618-019", title: "비급여 도수치료 · 통원 한도 적용 분쟁", region: "인천 연수", matchingScore: 74, claimedMinAmount: 3_200_000, claimedMaxAmount: 4_800_000, offerHeadroom: 1_600_000, issueCount: 1 },
  { reportId: crypto.randomUUID(), accidentType: "교통사고", status: "AWAITING_INSPECTION", createdAt: "2026-06-17T14:05:00Z", caseId: "20260517-007", title: "경추 염좌 · 향후 치료비 미반영", region: "경기 수원", matchingScore: 82, claimedMinAmount: 6_000_000, claimedMaxAmount: 9_000_000, offerHeadroom: 1_800_000, issueCount: 1 },
];

const heldReportIds = new Set<string>();

// 거절된 제안(키: `${reportId}:${adjusterId}`) — 거절 후 목록에서 제외 재현.
const rejectedProposals = new Set<string>();

export const handlers = [
  http.get("/api/ping", () => HttpResponse.json({ message: "pong (mocked)" })),

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

    const list = PENDING_REVIEWS.map((review) => ({
      ...review,
      held: heldReportIds.has(review.reportId),
    }));

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        list,
        pagination: { page, size, totalElements: list.length, totalPages: 1, hasNext: false },
      },
    });
  }),

  // 검수 보류 처리 (⚠️ API 명세 미정 — 목업)
  http.patch(`${API_BASE_URL}/reports/:reportId/hold`, async ({ params }) => {
    await delay(300);
    const reportId = String(params.reportId);
    heldReportIds.add(reportId);

    return HttpResponse.json({
      status: "200",
      message: "보류 처리되었습니다.",
      data: { reportId, held: true },
    });
  }),

  // 검수 현황 요약 (⚠️ API 명세 미정 — 목업)
  http.get(`${API_BASE_URL}/reports/pending-review/summary`, async () => {
    await delay(300);

    const pendingCount = PENDING_REVIEWS.filter((r) => !heldReportIds.has(r.reportId)).length;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { pendingCount, specialtyMatchCount: 3, dueSoonCount: 1 },
    });
  }),

  // 받은 제안 목록 조회 (이슈 #18) — 거절된 제안은 제외
  http.get(`${API_BASE_URL}/reports/:reportId/proposals`, async ({ params }) => {
    await delay(500);

    const reportId = typeof params.reportId === "string" ? params.reportId : "";
    const list = [
      {
        adjusterId: "11111111-1111-4111-8111-111111111111",
        nickname: "김도현",
        rating: 4.8,
        proposalSummary: "장해등급 재산정으로 12급 적용 여지가 있어 보입니다. 상담 후 함께 판단해요.",
        status: "COMPLETED",
        submittedAt: "2026-05-22T10:14:00+09:00",
        speciality: "후유장해 전문",
        career: 12,
        isNew: true,
        isVerified: true,
        estimateMinAmount: 14_000_000,
        estimateMaxAmount: 17_500_000,
        feeBasis: "상담 시 서면 안내",
      },
      {
        adjusterId: "22222222-2222-4222-8222-222222222222",
        nickname: "정우성",
        rating: 4.6,
        proposalSummary: "외모추상 특약 누락 건까지 함께 청구를 검토할 수 있습니다.",
        status: "COMPLETED",
        submittedAt: "2026-05-21T16:40:00+09:00",
        speciality: "후유장해 전문",
        career: 18,
        isNew: true,
        isVerified: true,
        estimateMinAmount: 13_500_000,
        estimateMaxAmount: 17_000_000,
        feeBasis: "상담 시 서면 안내",
      },
      {
        adjusterId: "33333333-3333-4333-8333-333333333333",
        nickname: "이서연",
        rating: 4.9,
        proposalSummary: "과실 비율 재검토 여지가 있는지 리포트를 살펴보고 싶습니다.",
        status: "COMPLETED",
        submittedAt: "2026-05-20T09:05:00+09:00",
        speciality: "교통사고 전문",
        career: 8,
        isNew: false,
        isVerified: true,
        estimateMinAmount: null,
        estimateMaxAmount: null,
        feeBasis: "상담 시 서면 안내",
      },
    ];

    const visible = list.filter(
      (proposal) => !rejectedProposals.has(`${reportId}:${proposal.adjusterId}`),
    );

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        target: {
          accidentType: "교통사고 · 후유장해",
          reportNo: "20260520-017",
          receivedAt: "2026.05.20",
        },
        list: visible,
        pagination: {
          page: 1,
          size: 10,
          totalElements: visible.length,
          totalPages: 1,
          hasNext: false,
        },
      },
    });
  }),

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

  // 리포트 상세 조회
  // ⚠️ 명세 드리프트: 고객측(issue: CONFIRMED/TRUSTED/INFO)·사정사측(reviewIssues 리치) 동일 URL.
  //   양측 스키마가 unknown 키를 strip하므로 superset 응답으로 둘 다 통과시킴.
  http.get(`${API_BASE_URL}/reports/:reportId`, async ({ params }) => {
    await delay(500);

    const reportId =
      typeof params.reportId === "string"
        ? params.reportId
        : crypto.randomUUID();

    // 같은 URL을 고객 리포트 상세와 사정사 검수가 공유.
    // 고객(test-id-123)은 매칭완료·확정 보상범위·사정사 코멘트가 필요하고,
    // 사정사 검수(uuid 진입)는 검수대기·미작성 상태가 필요 → 충돌 필드만 분기.
    const isCustomerSample = reportId === "test-id-123";

    // 응답 reportId는 zod uuid 검증을 통과해야 함. uuid 진입(사정사)은 그대로,
    // 그 외(고객 샘플 등 비-uuid)는 uuid 생성으로 대체.
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
        // 고객측 호환 필드(superset)
        issue: [
          {
            title: "외모추상 특약 누락",
            opinion: "누락분 청구 검토가 가장 확실한 출발점이에요.",
            status: "CONFIRMED",
            tag: "특약 제5조",
          },
          {
            title: "장해등급 적용",
            opinion: "현재 자료만으로는 12급 적용을 단정하기 어려워요.",
            status: "TRUSTED",
            tag: "약관 제12조",
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
        adjusterId: crypto.randomUUID(),
        reviewComment: isCustomerSample
          ? "누락된 청구 검토가 가능한 출발점입니다. 장해등급은 재검사 결과를 보고 판단하는 편이 안전합니다."
          : null,
        reviewedAt: isCustomerSample ? "2026.05.22" : null,
        adjuster: { nickname: "정우성", career: "12년 경력 손해사정사" },

        // 사정사 검수 확장 필드(MSW 전용)
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
            id: "issue-1",
            title: "후유장해 등급 재산정",
            description:
              "AI 초안은 14급으로 추정했으나, 관절 운동범위 제한 정도를 고려하면 12급 적용 여지가 있습니다.",
            impactAmount: 3_500_000,
            status: "PENDING",
            modifiedReason: null,
            excludedReason: null,
            adjusterOpinion: null,
            tags: ["약관 제12조", "분쟁조정 2023-1456"],
            isNew: false,
          },
          {
            id: "issue-2",
            title: "입원 일당 미반영분",
            description: "입원 17일 중 초안에 14일만 반영되어 3일분 누락 추정.",
            impactAmount: 600_000,
            status: "PENDING",
            modifiedReason: null,
            excludedReason: null,
            adjusterOpinion: null,
            tags: ["특약 제5조"],
            isNew: false,
          },
          {
            id: "issue-3",
            title: "외모변형 장해 특약 적용",
            description:
              "수술 흉터 관련 외모변형 장해 특약 청구 가능성 검토 항목.",
            impactAmount: null,
            status: "PENDING",
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
