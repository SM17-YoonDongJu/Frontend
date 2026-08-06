import type { FallbackProps } from "react-error-boundary";
import { ErrorState } from "@/shared/ui/ErrorState";

export function ReportListErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <ErrorState
      layout="page"
      title="리포트를 불러오지 못했어요"
      code={(error as Error).name}
      onRetry={resetErrorBoundary}
    />
  );
}
