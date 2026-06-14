import { Assistant } from "./components/Assistant";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="h-screen">
      <main className="relative flex h-2/3 flex-col items-center justify-around px-4 pt-10 md:px-8">
        <Assistant />
      </main>
    </div>
  );
}
