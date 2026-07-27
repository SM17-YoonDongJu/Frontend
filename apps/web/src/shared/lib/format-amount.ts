const WON_PER_MANWON = 10_000;

export function formatManwon(won: number): string {
  return Math.round(won / WON_PER_MANWON).toLocaleString("ko-KR");
}

export function formatManwonRange(min: number, max: number): string {
  const formattedMin = formatManwon(min);
  const formattedMax = formatManwon(max);
  return formattedMax !== formattedMin
    ? `${formattedMin}~${formattedMax}만원`
    : `${formattedMin}만원`;
}

export function formatWon(won: number): string {
  return `${won.toLocaleString("ko-KR")}원`;
}
