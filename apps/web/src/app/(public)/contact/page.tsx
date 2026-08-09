import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "./_components/ContactForm";

const CONTACT_EMAIL = "teambrbosang@gmail.com";

export const metadata: Metadata = {
  title: "문의하기",
  description: "바른보상 서비스 이용 중 궁금한 점이나 문의 사항을 남겨주세요."
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
              서비스 이용 중 궁금한 점이나 불편 사항이 있다면 아래 양식으로 문의해 주세요. 확인 후
              입력하신 이메일로 순차적으로 답변드립니다.
            </p>
          </section>

          <section>
            <ContactForm />
          </section>

          <section>
            <h2 className="text-[0.9375rem] font-bold text-ink">직접 메일 보내기</h2>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">
              양식 대신 메일을 직접 보내시려면{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline underline-offset-2">
                {CONTACT_EMAIL}
              </a>
              로 보내주세요.
            </p>
          </section>

          <section>
            <h2 className="text-[0.9375rem] font-bold text-ink">계정 삭제 문의</h2>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">
              계정과 관련 데이터 삭제를 원하시면{" "}
              <Link
                href="/account-deletion"
                className="text-ink underline underline-offset-2"
              >
                계정 삭제 안내
              </Link>
              에서 삭제 절차와 삭제되는 데이터를 확인하실 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
