import { delay, http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/shared/api/config";

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

  // 분석 신청 생성 — 실손(MEDICAL_EXPENSE)만 허용, 그 외 UNSUPPORTED_OPERATION
  http.post(`${API_BASE_URL}/reports`, async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { accidentType?: string };

    if (body.accidentType !== "MEDICAL_EXPENSE") {
      return HttpResponse.json(
        { status: "400", code: "UNSUPPORTED_OPERATION", message: "현재 실손 의료비만 분석 가능합니다." },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "분석 요청이 접수되었습니다.",
      data: { reportId: crypto.randomUUID(), status: "AWAITING_INSPECTION" },
    });
  }),

  // 리포트 상세 조회
  http.get(`${API_BASE_URL}/reports/:reportId`, async () => {
    await delay(500);

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        reportId: crypto.randomUUID(),
        status: "MATCHED",
        accidentType: "질병",
        treatment: "요추 추간판 탈출증",
        claimedMinAmount: 13_500_000,
        claimedMaxAmount: 17_000_000,
        offeredAmount: 8_500_000,
        applicableGuarantees: ["상해후유장해 담보", "골절 진단비 특약", "입원·통원 일당"],
        omittedSpecialContract: ["외모변형 장해특약"],
        basisTermsPrecedents: [
          "약관 제12조 (후유장해 보험금 산정기준)",
          "분쟁조정 2023-1456 (장해등급 재산정 인정 사례)",
          "대법원 2019다○○○○ (후유장해 인과관계 판단)",
        ],
        issue: ["의료자문 동의서 누락", "장해등급 적용 재검토", "진행 방향: 추가 자료 확보 후 재산정"],
        question: "보험금이 적게 나온 것 같아요",
        confidenceLevel: "HIGH",
        adjusterId: crypto.randomUUID(),
        reviewComment:
          "누락된 청구 검토가 가능한 출발점입니다. 장해등급은 재검사 결과를 보고 판단하는 편이 안전합니다.",
        reviewedAt: "2026.05.22",
        adjuster: { nickname: "정우성", career: "12년 경력 손해사정사" },
      },
    });
  }),
];
