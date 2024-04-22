/* eslint-disable @next/next/no-img-element */
import Viewer from "@/interfaces/Viewer";
import server_fetch from "@/utils/server-fetch";
import { NextPage } from "next";
import MediaListing from "@/components/media-listing";
import { Suspense } from "react";
import MediaListingSkeleton from "@/components/media-listing-skeleton";

interface Props {}

const HomePage: NextPage<Props> = async ({}) => {
  const res = await server_fetch(`/api/viewer`);
  const viewer: Viewer = await res.json();

  return (
    <div className="flex flex-col p-8 gap-4">
      <header className="p-4 flex items-center rounded bg-zinc-800 gap-4">
        <img
          className="size-12 rounded-full object-cover"
          src={viewer.avatar}
          alt={viewer.name}
        />
        <p className="text-lg font-medium">{viewer.name}</p>
      </header>
      <Suspense fallback={<MediaListingSkeleton />}>
        <MediaListing
          title="Watching"
          listing="watching"
          viewerId={viewer.id}
        />
      </Suspense>
      <Suspense fallback={<MediaListingSkeleton length={2} />}>
        <MediaListing
          title="Recently Completed"
          listing="completed"
          viewerId={viewer.id}
        />
      </Suspense>
    </div>
  );
};

export default HomePage;
