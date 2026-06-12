import { getDashboardData } from "./actions/dashboard";
import { Assistant } from "./components/Assistant/Assistant";

export default async function Home() {
  const data = await getDashboardData();

  return (
    <main className="mx-10 flex gap-4 font-mono">
      <aside className="flex w-2xs flex-col">
        {/* TODO: collapsible sidebar */}
        {data.markets.map((market) => {
          return <span key={market.id}>{market.name}</span>;
        })}
      </aside>

      <Assistant />
    </main>
  );
}
