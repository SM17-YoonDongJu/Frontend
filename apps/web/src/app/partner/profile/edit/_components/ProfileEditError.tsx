import { Button } from "@/shared/ui/Button";

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  FORBIDDEN: { title: "접근 권한이 없어요", desc: "손해사정사만 프로필을 수정할 수 있어요." },
};

export function ProfileEditError({ code, onRetry }: { code?: string; onRetry: () => void }) {
  const known = code ? ERROR_MESSAGES[code] : undefined;
  const message = known ?? { title: "프로필을 불러오지 못했어요", desc: "잠시 후 다시 시도해 주세요." };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
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
