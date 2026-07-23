import { Button } from "@/shared/ui/Button";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";

export type ErrorLayout = "card" | "page" | "flow" | "fill";

export interface ErrorStateProps {
  layout: ErrorLayout;
  title?: string;
  code?: string;
  messages?: Record<string, { title: string; desc: string }>;
  onRetry: () => void;
  /** 에지 여백 등 바깥 배치용. 레이아웃 자체는 layout이 소유하고, 여백만 호출부가 주입. */
  className?: string;
}

const WRAPPER: Record<ErrorLayout, string> = {
  card: "rounded-card border border-line bg-card px-6 py-12",
  page: "mx-auto max-w-md px-4 py-24",
  flow: "px-6 py-20",
  fill: "flex-1 justify-center px-6 py-16",
};

const COMPACT: Record<ErrorLayout, boolean> = {
  card: true,
  fill: true,
  page: false,
  flow: false,
};

/** 화면 공통 기본 문구 — 화면별 messages가 같은 코드를 주면 그쪽이 우선. */
const DEFAULT_MESSAGES: Record<string, { title: string; desc: string }> = {
  FORBIDDEN: {
    title: "접근 권한이 없어요",
    desc: "지금 계정으로는 이 화면을 볼 수 없어요.",
  },
};

export function ErrorState({ layout, title, code, messages, onRetry, className }: ErrorStateProps) {
  const forbidden = code === "FORBIDDEN";
  const known = code ? (messages?.[code] ?? DEFAULT_MESSAGES[code]) : undefined;
  const heading = known?.title ?? title ?? "정보를 불러오지 못했어요";
  const description = known?.desc ?? "잠시 후 다시 시도해 주세요.";
  const showRetry = !forbidden && !known;
  const compact = COMPACT[layout];

  const icon = forbidden ? (
    <span
      className={`flex items-center justify-center rounded-full bg-gold-soft text-gold-ink ${compact ? "size-10" : "size-14"}`}
    >
      <ShieldCheck className={compact ? "text-[1.125rem]" : "text-[1.5rem]"} />
    </span>
  ) : (
    <span
      className={`flex items-center justify-center rounded-full bg-terra-soft text-terra ${compact ? "size-10" : "size-14"}`}
    >
      <AlertTriangle className={compact ? "text-[1.125rem]" : "text-[1.5rem]"} />
    </span>
  );

  return (
    <div
      role={forbidden ? "status" : "alert"}
      className={`flex flex-col items-center text-center ${WRAPPER[layout]}${className ? ` ${className}` : ""}`}
    >
      {icon}
      {compact ? (
        <>
          <h3 className="mt-3 text-[0.9375rem] font-semibold text-ink">{heading}</h3>
          <p className="mt-1.5 text-[0.8125rem] text-ink-3">{description}</p>
          {code && !forbidden && <p className="mt-1 text-[0.75rem] text-ink-3">({code})</p>}
          {showRetry && (
            <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
              다시 시도
            </Button>
          )}
        </>
      ) : (
        <>
          <h2 className="mt-5 text-[1.125rem] font-semibold text-ink">{heading}</h2>
          <p className="mt-2 text-[0.875rem] text-ink-3">{description}</p>
          {showRetry && (
            <Button className="mt-5" onClick={onRetry}>
              다시 시도
            </Button>
          )}
        </>
      )}
    </div>
  );
}
