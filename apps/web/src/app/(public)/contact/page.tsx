import type { Metadata } from "next";

const CONTACT_EMAIL = "teambrbosang@gmail.com";

export const metadata: Metadata = {
  title: "문의하기",
  description: "바른보상 서비스 이용 중 궁금한 점이나 문의 사항을 이메일로 남겨주세요."
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[48rem] px-6 py-10 sm:py-14">
      <h1 className="font-serif text-xl font-bold text-ink">문의하기</h1>

      <div className="mt-6 rounded-card-lg border border-line bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="text-[0.9375rem] font-bold text-ink">문의 안내</h2>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">
              서비스 이용 중 궁금한 점이나 불편 사항이 있다면 아래 이메일로 문의해 주세요. 확인 후
              순차적으로 답변드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-[0.9375rem] font-bold text-ink">이메일</h2>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
