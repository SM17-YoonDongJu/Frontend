import { cn } from "@/shared/lib/utils";
import { Spinner } from "@/shared/ui/icons/Spinner";

export type UploadStatus = "uploading" | "done" | "error";

interface UploadFileItemProps {
  name: string;
  size: number;
  status: UploadStatus;
  previewUrl?: string;
  errorMessage?: string;
  onRetry: () => void;
  onRemove: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function UploadFileItem({
  name,
  size,
  status,
  previewUrl,
  errorMessage,
  onRetry,
  onRemove,
}: UploadFileItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-card border bg-card px-3.5 py-3",
        status === "error" ? "border-terra" : "border-line",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-paper-2">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ink-3">
            <path d="M6 2h8l4 4v16a0 0 0 0 1 0 0H6a0 0 0 0 1 0 0V2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M14 2v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-ink">{name}</p>
        <p className="text-[12px] text-ink-3">
          {status === "uploading" && "업로드 중…"}
          {status === "done" && formatBytes(size)}
          {status === "error" && (
            <span className="text-terra">{errorMessage ?? "업로드 실패"}</span>
          )}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {status === "uploading" && <Spinner />}
        {status === "done" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-green">
            <path d="m5 12.5 4 4 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {status === "error" && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-pill border border-line px-2.5 py-1 text-[12.5px] text-ink-2 hover:border-ink/40"
          >
            재시도
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="삭제"
          className="text-ink-3 hover:text-terra"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
