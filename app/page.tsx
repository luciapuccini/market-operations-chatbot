import { getDashboardData } from "./actions/dashboard";
import { Assistant } from "./components/Assistant/Assistant";

export default async function Home() {
  const data = await getDashboardData();

  return (
    <main className="flex gap-4">
      <aside className="flex h-screen w-2xs flex-col justify-between border-e border-gray-100 bg-white">
        {/* TODO: collapsible sidebar */}
        {data.markets.map((market) => {
          return <span key={market.id}>{market.name}</span>;
        })}
      </aside>

      <Assistant />
    </main>
  );
}
