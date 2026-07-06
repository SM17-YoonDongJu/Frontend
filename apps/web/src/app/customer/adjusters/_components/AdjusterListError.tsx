import { Button } from "@/shared/ui/Button";

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  INTERNAL_SERVER_ERROR: {
    title: "손해사정사 목록을 불러오지 못했어요",
    desc: "일시적인 서버 오류예요. 잠시 후 다시 시도해 주세요.",
  },
};

export function AdjusterListError({ code, onRetry }: { code?: string; onRetry: () => void }) {
  const message =
    (code ? ERROR_MESSAGES[code] : undefined) ?? {
      title: "손해사정사 목록을 불러오지 못했어요",
      desc: "잠시 후 다시 시도해 주세요.",
    };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h2 className="text-lg font-semibold text-ink">{message.title}</h2>
      <p className="mt-2 text-sm text-ink-3">{message.desc}</p>
      <Button className="mt-5" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}
