const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const pad = (value: number) => String(value).padStart(2, "0");

/** 말풍선 시각 — "오후 2:40" */
export function formatMessageTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

/** 날짜 구분선 라벨 — "2026.05.21" */
export function formatDateDividerLabel(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/** 두 시각이 같은 날(YYYY-MM-DD)인지 */
export function isSameDay(a: string, b: string): boolean {
  return formatDateDividerLabel(a) === formatDateDividerLabel(b);
}

/** 목록 행 시각 — 오늘 "오후 2:14" · 어제 "어제" · 그 외 "05.19". 메시지 없는 방(생성 직후)은 "" */
export function formatRoomListTime(iso: string | null, now: Date = new Date()): string {
  if (!iso) return "";
  const date = new Date(iso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000,
  );

  if (dayDiff <= 0) return timeFormatter.format(date);
  if (dayDiff === 1) return "어제";
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}
