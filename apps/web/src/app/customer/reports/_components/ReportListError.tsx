import { Button } from "@/shared/ui/Button";

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  LOGIN_REQUIRED: {
    title: "로그인이 필요해요",
    desc: "다시 로그인한 뒤 시도해 주세요.",
  },
};

export function ReportListError({ code, onRetry }: { code?: string; onRetry: () => void }) {
  const known = code ? ERROR_MESSAGES[code] : undefined;
  const message = known ?? {
    title: "리포트를 불러오지 못했어요",
    desc: "잠시 후 다시 시도해 주세요.",
  };

  return (
    <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center px-6 py-20 text-center">
      <h2 className="text-[1.125rem] font-semibold text-ink">{message.title}</h2>
      <p className="mt-2 text-[0.875rem] text-ink-3">{message.desc}</p>
      {!known && (
        <Button className="mt-5" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
