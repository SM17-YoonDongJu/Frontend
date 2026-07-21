import { Button } from "@/shared/ui/Button";

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

export function ErrorState({ layout, title, code, messages, onRetry, className }: ErrorStateProps) {
  const known = code ? messages?.[code] : undefined;
  const heading = known?.title ?? title ?? "정보를 불러오지 못했어요";
  const description = known?.desc ?? "잠시 후 다시 시도해 주세요.";
  const compact = COMPACT[layout];

  return (
    <div
      role="alert"
      className={`flex flex-col items-center text-center ${WRAPPER[layout]}${className ? ` ${className}` : ""}`}
    >
      {compact ? (
        <>
          <h3 className="text-[0.9375rem] font-semibold text-ink">{heading}</h3>
          <p className="mt-1.5 text-[0.8125rem] text-ink-3">{description}</p>
          {code && <p className="mt-1 text-[0.75rem] text-ink-3">({code})</p>}
          {!known && (
            <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
              다시 시도
            </Button>
          )}
        </>
      ) : (
        <>
          <h2 className="text-[1.125rem] font-semibold text-ink">{heading}</h2>
          <p className="mt-2 text-[0.875rem] text-ink-3">{description}</p>
          {!known && (
            <Button className="mt-5" onClick={onRetry}>
              다시 시도
            </Button>
          )}
        </>
      )}
    </div>
  );
}
