import React, { Suspense } from "react";
import Episodes from "@/components/episodes";
import EpisodesSkeleton from "@/components/episodes-skeleton";

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
        <Suspense fallback={<EpisodesSkeleton />}>
          <Episodes id={Number(id)} />
        </Suspense>
      </div>
    </section>
  );
}
