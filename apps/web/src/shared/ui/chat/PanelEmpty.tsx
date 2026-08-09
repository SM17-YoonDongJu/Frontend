export function PanelEmpty({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-[0.9375rem] font-semibold text-ink">{title}</p>
      <p className="mt-1.5 text-[0.8125rem] text-ink-3">{description}</p>
    </div>
  );
}
