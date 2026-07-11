import { Button } from "@/shared/ui/Button";

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  POST_NOT_FOUND: { title: "리포트를 찾을 수 없어요", desc: "삭제되었거나 잘못된 주소예요." },
  FORBIDDEN: { title: "접근 권한이 없어요", desc: "본인 리포트만 확인할 수 있어요." },
};

export function ReportDetailError({ code, onRetry }: { code?: string; onRetry: () => void }) {
  const known = code ? ERROR_MESSAGES[code] : undefined;
  const message = known ?? { title: "리포트를 불러오지 못했어요", desc: "잠시 후 다시 시도해 주세요." };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
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
