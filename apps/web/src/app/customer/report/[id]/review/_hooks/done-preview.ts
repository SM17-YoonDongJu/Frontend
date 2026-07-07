export interface ReviewDonePreview {
  nickname: string;
  score: number;
  content: string;
  adjusterName: string;
}

const storageKey = (reportId: string) => `review-done:${reportId}`;

/** 이름 첫 글자만 남기고 마스킹("윤성호" → "윤**"). 한 글자 이하는 서버 규칙과 동일하게 원문 유지. */
export function maskNickname(name: string): string {
  const chars = [...name.trim()];
  if (chars.length <= 1) return chars.join("");
  const [first, ...rest] = chars;
  return first + "*".repeat(rest.length);
}

export function saveReviewDonePreview(reportId: string, preview: ReviewDonePreview) {
  try {
    sessionStorage.setItem(storageKey(reportId), JSON.stringify(preview));
  } catch {
    // 세션 스토리지 비활성 — 완료 화면은 상세로 fallback
  }
}

export function readReviewDonePreview(reportId: string): ReviewDonePreview | null {
  try {
    const raw = sessionStorage.getItem(storageKey(reportId));
    if (!raw) return null;
    return JSON.parse(raw) as ReviewDonePreview;
  } catch {
    return null;
  }
}

export function clearReviewDonePreview(reportId: string) {
  try {
    sessionStorage.removeItem(storageKey(reportId));
  } catch {
    // noop
  }
}
