type InsuranceProduct = {
  id: string;
  name: string;
  category: "life" | "health" | "auto" | "travel";
  monthlyPremium: number;
};

const sample: InsuranceProduct = {
  id: "demo",
  name: "데모 상품",
  category: "health",
  monthlyPremium: 30000
};

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold tracking-tight text-brand">Insurance Platform</h1>
      <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
        <p className="text-sm text-gray-500">{sample.category}</p>
        <p className="mt-1 text-lg font-semibold">{sample.name}</p>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          월 {sample.monthlyPremium.toLocaleString()}원
        </p>
      </div>
    </main>
  );
}
