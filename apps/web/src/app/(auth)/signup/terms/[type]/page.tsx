import { notFound } from "next/navigation";
import { TermsBackButton } from "./_components/TermsBackButton";
import { isTermsType, TERMS_TYPES } from "../../_shared/model/terms";
import { TERMS_CONTENT } from "./_model/terms-content";

/** 3종 약관 상세를 정적 프리렌더(SSG). */
export function generateStaticParams() {
  return TERMS_TYPES.map((type) => ({ type }));
}

interface TermsDetailPageProps {
  params: Promise<{ type: string }>;
}

export default async function TermsDetailPage({ params }: TermsDetailPageProps) {
  const { type } = await params;
  if (!isTermsType(type)) notFound();

  const document = TERMS_CONTENT[type];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <TermsBackButton />
        <h1 className="font-serif text-xl font-bold text-ink">{document.title}</h1>
      </div>

      <div className="mt-6 rounded-card-lg border border-line bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6">
          {document.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[0.9375rem] font-bold text-ink">{section.heading}</h2>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">{section.body}</p>
            </section>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-3">
        본 약관은 예시 문안이며, 실제 서비스 약관으로 대체될 수 있어요.
      </p>
    </div>
  );
}
