import { cn } from "@/shared/lib/utils";
import { Check } from "@/shared/ui/icons/Check";
import { FileText } from "@/shared/ui/icons/FileText";
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

const ICON_BOX_STYLE: Record<UploadStatus, string> = {
  uploading: "bg-gold-soft text-gold-ink",
  done: "bg-green-soft text-green",
  error: "bg-terra-soft text-terra",
};

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
        "flex items-center gap-3 rounded-input border bg-card px-3.5 py-3",
        status === "error" ? "border-terra" : "border-line",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-chip text-[1.125rem]",
          ICON_BOX_STYLE[status],
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <FileText />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8125rem] font-bold text-ink">{name}</p>
        <p className="text-[0.6875rem]">
          {status === "uploading" && <span className="text-gold-ink">분석 중</span>}
          {status === "done" && <span className="text-ink-3">{formatBytes(size)}</span>}
          {status === "error" && <span className="text-terra">{errorMessage ?? "업로드 실패"}</span>}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {status === "uploading" && <Spinner />}
        {status === "done" && <Check className="text-[1.125rem] text-green" />}
        {status === "error" && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-pill border border-line px-2.5 py-1 text-[0.78125rem] text-ink-2 transition hover:border-ink/40"
          >
            재시도
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          aria-label="삭제"
          className="text-ink-3 transition hover:text-terra"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
