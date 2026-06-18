import { delay, http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/shared/api/config";

export const handlers = [
  http.get("/api/ping", () => HttpResponse.json({ message: "pong (mocked)" })),

  // 증빙 업로드 — 지연 + ~30% 랜덤 실패(재시도 검증용)
  http.post(`${API_BASE_URL}/uploads`, async () => {
    await delay(800 + Math.random() * 700);

    if (Math.random() < 0.3) {
      return HttpResponse.json(
        { status: "502", code: "EXTERNAL_API_ERROR", message: "업로드 처리 중 오류가 발생했습니다." },
        { status: 502 },
      );
    }

    const url = `https://cdn.example.com/uploads/${crypto.randomUUID()}/document`;
    return HttpResponse.json({ status: "200", message: "업로드 성공", data: { url } });
  }),
];
