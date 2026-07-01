const MS_PER_DAY = 24 * 60 * 60 * 1000;

function diffInDays(deadlineIso: string, today: Date): number {
  const parts = deadlineIso.slice(0, 10).split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const startOfDeadline = Date.UTC(year, month - 1, day);
  const startOfToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((startOfDeadline - startOfToday) / MS_PER_DAY);
}

export function formatReviewDue(
  deadlineIso: string,
  today: Date,
): { label: string; urgent: boolean } {
  const diffDays = diffInDays(deadlineIso, today);

  if (diffDays < 0) return { label: "기한 지남", urgent: true };
  if (diffDays === 0) return { label: "오늘 마감", urgent: true };
  if (diffDays === 1) return { label: "내일 마감", urgent: true };
  return { label: `${diffDays}일 남음`, urgent: false };
}
