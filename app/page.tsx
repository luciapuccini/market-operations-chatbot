import { getDashboardData } from "./controllers/actions/dashboard";
import { Assistant } from "./components/Assistant/Assistant";

export default async function Home() {
  return (
    <main>
      <Assistant />
    </main>
  );
}
