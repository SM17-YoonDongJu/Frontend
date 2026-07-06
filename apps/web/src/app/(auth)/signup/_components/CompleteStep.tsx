import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { Button } from "@/shared/ui/Button";

interface CompleteStepProps {
  nickname: string;
  email?: string;
  onStartAnalysis: () => void;
}

interface SummaryRow {
  label: string;
  value: string;
}

/** Step3: 가입 완료 안내 + 계정 요약 + 보상 분석 시작 CTA. */
export function CompleteStep({ nickname, email, onStartAnalysis }: CompleteStepProps) {
  const rows: SummaryRow[] = [
    { label: "이메일", value: email ?? "미등록" },
    { label: "이름", value: nickname },
    { label: "본인 인증", value: "완료" },
  ];

  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-[4.75rem] items-center justify-center rounded-card-lg bg-green-soft text-[2.5rem] text-green">
        <CheckCircle />
      </span>

      <h1 className="mt-6 font-serif text-[1.5rem] font-bold text-ink">가입이 완료됐어요</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-3">
        {nickname} 님, 환영합니다.
        <br />
        이제 보상 분석을 시작해보세요.
      </p>

      <dl className="mt-6 w-full rounded-card border border-line bg-card px-[1.125rem]">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={index > 0 ? "flex items-center justify-between border-t border-line-2 py-3.5" : "flex items-center justify-between py-3.5"}
          >
            <dt className="text-[0.8125rem] text-ink-3">{row.label}</dt>
            <dd className="text-sm font-bold text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <Button
        full
        size="lg"
        variant="gold"
        className="mt-6"
        onClick={onStartAnalysis}
        icon={<ArrowRight className="text-[1.1rem]" />}
      >
        보상 분석 시작
      </Button>
    </div>
  );
}
