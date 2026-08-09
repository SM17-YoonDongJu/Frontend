import { TERMS_CONTENT } from "@/shared/model/terms-content";

export default function TermsPage() {
  const document = TERMS_CONTENT.service;

  return (
    <div className="mx-auto w-full max-w-[48rem] px-6 py-10 sm:py-14">
      <h1 className="font-serif text-xl font-bold text-ink">{document.title}</h1>

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
    </div>
  );
}
