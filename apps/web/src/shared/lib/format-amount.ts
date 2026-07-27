const WON_PER_MANWON = 10_000;

export function formatManwon(won: number): string {
  return Math.round(won / WON_PER_MANWON).toLocaleString("ko-KR");
}

export function formatManwonRange(min: number, max: number): string {
  return max !== min
    ? `${formatManwon(min)}~${formatManwon(max)}만원`
    : `${formatManwon(min)}만원`;
}

export function formatWon(won: number): string {
  return `${won.toLocaleString("ko-KR")}원`;
}
