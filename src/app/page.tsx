import { Grid } from "@/components/grid/grid";

export default function Home() {
  return (
    <div className="items-center justify-items-center p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <Grid />
      </main>
    </div>
  );
}
