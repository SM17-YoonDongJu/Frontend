import type { MatchGroup } from "@/shared/api/chat/match-status";
import { StatusBadge, type StatusBadgeProps } from "@/shared/ui/StatusBadge";

interface MatchBadgeMeta {
  label: string;
  tone: NonNullable<StatusBadgeProps["tone"]>;
}

/** comparing은 배지 없음(null) — matched/ended만 표시 라벨을 가진다. */
const MATCH_BADGE_META: Record<Exclude<MatchGroup, "comparing">, MatchBadgeMeta> = {
  matched: { label: "매칭 완료", tone: "green" },
  ended: { label: "종료", tone: "neutral" },
};

interface MatchStatusBadgeProps {
  group: MatchGroup;
}

/** 방의 매칭 그룹을 이름 옆 상태 배지로 표현. 비교중이면 렌더하지 않는다. */
export function MatchStatusBadge({ group }: MatchStatusBadgeProps) {
  if (group === "comparing") return null;

  const meta = MATCH_BADGE_META[group];
  return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
}
