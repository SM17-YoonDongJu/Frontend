const BUBBLE_WIDTHS = ["60%", "45%", "70%", "40%"];

export function ChatThreadSkeleton() {
  return (
    <div aria-hidden className="flex flex-1 animate-pulse flex-col gap-3 px-4 py-4">
      {BUBBLE_WIDTHS.map((width, index) => (
        <div
          key={index}
          className={index % 2 === 0 ? "flex justify-start" : "flex justify-end"}
        >
          <div className="h-10 rounded-[0.9375rem] bg-line-2" style={{ width }} />
        </div>
      ))}
    </div>
  );
}
