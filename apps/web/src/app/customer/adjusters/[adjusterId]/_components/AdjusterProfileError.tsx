import { Button } from "@/shared/ui/Button";

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  USER_NOT_FOUND: {
    title: "손해사정사를 찾을 수 없어요",
    desc: "삭제되었거나 잘못된 주소예요.",
  },
};

export function AdjusterProfileError({
  code,
  onRetry,
}: {
  code?: string;
  onRetry: () => void;
}) {
  const known = code ? ERROR_MESSAGES[code] : undefined;
  const message =
    known ?? { title: "프로필을 불러오지 못했어요", desc: "잠시 후 다시 시도해 주세요." };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h2 className="text-lg font-semibold text-ink">{message.title}</h2>
      <p className="mt-2 text-sm text-ink-3">{message.desc}</p>
      {!known && (
        <Button className="mt-5" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
