import type { Metadata } from "next";
import Link from "next/link";
import {
  ACCOUNT_DELETION_SECTIONS,
  APP_NAME,
  DELETION_REQUEST_EMAIL
} from "./_model/content";

export const metadata: Metadata = {
  title: "계정 삭제 안내",
  description: `${APP_NAME} 계정과 관련 데이터를 삭제하는 방법, 삭제되는 데이터 항목과 보관 기간을 안내합니다.`
};

export default function AccountDeletionPage() {
  return (
    <div className="mx-auto w-full max-w-[48rem] px-6 py-10 sm:py-14">
      <h1 className="font-serif text-xl font-bold text-ink">계정 삭제 안내</h1>

      <div className="mt-6 rounded-card-lg border border-line bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          {ACCOUNT_DELETION_SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[0.9375rem] font-bold text-ink">{section.heading}</h2>

              {section.items ? (
                section.ordered ? (
                  <ol className="mt-2 flex list-decimal flex-col gap-1.5 pl-[1.125rem] text-[0.8125rem] leading-relaxed text-ink-2">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-[1.125rem] text-[0.8125rem] leading-relaxed text-ink-2">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )
              ) : null}

              {section.body ? (
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">{section.body}</p>
              ) : null}
            </section>
          ))}

          <section>
            <h2 className="text-[0.9375rem] font-bold text-ink">메일로 삭제 요청하기</h2>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">
              앱이나 웹에 접속하기 어려운 경우{" "}
              <a
                href={`mailto:${DELETION_REQUEST_EMAIL}`}
                className="text-ink underline underline-offset-2"
              >
                {DELETION_REQUEST_EMAIL}
              </a>
              로 가입하신 계정 정보와 함께 삭제를 요청해 주세요. 본인 확인 후 처리해 드립니다.
              개인정보 처리에 대한 자세한 내용은{" "}
              <Link href="/privacy" className="text-ink underline underline-offset-2">
                개인정보 처리방침
              </Link>
              에서 확인하실 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
