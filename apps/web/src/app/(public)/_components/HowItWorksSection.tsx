import type { ReactNode } from "react";
import { FileText } from "@/shared/ui/icons/FileText";
import { Upload } from "@/shared/ui/icons/Upload";
import { User } from "@/shared/ui/icons/User";

interface Step {
  no: string;
  icon: ReactNode;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    no: "01",
    icon: <Upload className="size-[1.625rem]" />,
    title: "정보·서류 입력",
    body: "사고 정보와 진단서·보험증권을 올리면 민감정보는 자동으로 가려집니다."
  },
  {
    no: "02",
    icon: <FileText className="size-[1.625rem]" />,
    title: "AI 분석 + 전문가 검수",
    body: "AI가 약관·특약·판례로 초안을 만들고, 손해사정사가 검수한 뒤 리포트가 공개됩니다."
  },
  {
    no: "03",
    icon: <User className="size-[1.625rem]" />,
    title: "전문가 연결",
    body: "분쟁 가능성이 높으면 적합한 손해사정사로 바로 연결됩니다."
  }
];

/**
 * PC 이용 방법 3단계 카드.
 */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-y border-line-2 bg-paper-2 py-[4.5rem]">
      <div className="mx-auto w-full max-w-[80rem] px-14">
        <p className="text-center text-[0.875rem] font-bold text-gold-ink">이용 방법</p>
        <h2 className="mt-[0.8125rem] text-center font-serif text-[2.375rem] font-bold text-ink">
          세 단계면 충분합니다
        </h2>

        <div className="mt-8 grid grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.no}
              className="rounded-card border border-line bg-card p-7 shadow-[0_0.0625rem_0.0625rem_rgba(21,32,46,0.03)]"
            >
              <p className="font-serif text-[0.875rem] font-bold text-gold-ink">{step.no}</p>
              <span className="mt-[1.125rem] flex size-[3.25rem] items-center justify-center rounded-[0.875rem] bg-navy text-white">
                {step.icon}
              </span>
              <h3 className="mt-[1.125rem] text-[1.1875rem] font-bold text-ink">{step.title}</h3>
              <p className="mt-[0.5625rem] text-[0.875rem] leading-[1.0625rem] text-ink-2">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
