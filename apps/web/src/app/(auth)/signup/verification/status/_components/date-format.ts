const pad = (value: number) => String(value).padStart(2, "0");

/** ISO → "YYYY.MM.DD". 파싱 실패 시 원문 유지. */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/** ISO → "YYYY.MM.DD HH:mm". 파싱 실패 시 원문 유지. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${formatDate(iso)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
