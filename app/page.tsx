import { getDashboardData } from "./actions/dashboard";
import { Assistant } from "./components/Assistant/Assistant";

export default async function Home() {
  const data = await getDashboardData();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Assistant />

      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        {data.markets.map((market) => {
          return <span key={market.id}>{market.name}</span>;
        })}
      </main>
    </div>
  );
}
