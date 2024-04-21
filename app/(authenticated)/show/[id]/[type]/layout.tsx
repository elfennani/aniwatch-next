import { Suspense } from "react";
import ShowEpisodes from "../components/ShowEpisodes";

export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <section className="h-dvh flex flex-col">
      <div>{children}</div>
      <div className="p-8 overflow-y-scroll h-full">
        <Suspense fallback={<ShowEpisodesSkeleton />}>
          <ShowEpisodes id={Number(id)} />
        </Suspense>
      </div>
    </section>
  );
}

const ShowEpisodesSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="w-full h-[69.75px] bg-zinc-800 rounded-md" />
    <div className="w-full h-[69.75px] bg-zinc-800 rounded-md" />
    <div className="w-full h-[69.75px] bg-zinc-800 rounded-md" />
  </div>
);
