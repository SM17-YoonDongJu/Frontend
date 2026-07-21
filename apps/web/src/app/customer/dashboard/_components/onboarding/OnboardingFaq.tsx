interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "비용은 언제 발생하나요?",
    answer: "사정사와 매칭을 확정하기 전까지는 비용이 없어요. 수수료는 제안에서 미리 확인해요.",
  },
  {
    question: "어떤 보험이든 가능한가요?",
    answer: "실손·상해·운전자·배상책임 등 대부분의 손해보험을 다뤄요.",
  },
  {
    question: "개인정보는 안전한가요?",
    answer: "입력한 정보는 검수를 맡은 사정사에게만 공개돼요.",
  },
];

export function OnboardingFaq() {
  return (
    <section className="rounded-card border border-line bg-card p-[1.6875rem]">
      <h2 className="text-base font-bold text-ink">자주 묻는 질문</h2>

      <dl className="mt-4">
        {FAQ_ITEMS.map((item, index) => (
          <div
            key={item.question}
            className={`py-[0.9375rem] ${index < FAQ_ITEMS.length - 1 ? "border-b border-line-2" : "pb-0"}`}
          >
            <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="font-serif text-gold-ink">Q</span>
              {item.question}
            </dt>
            <dd className="mt-1.5 pl-[1.375rem] text-[0.8125rem] leading-[1.6] text-ink-2">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
