/* eslint-disable @next/next/no-img-element */
import Media from "@/interfaces/Media";
import server_fetch from "@/utils/server-fetch";
import MediaItem from "./media-item";

type Props = {
  viewerId: number;
  title: string;
  listing: "watching" | "completed";
};

const MediaListing = async ({ viewerId, title, listing }: Props) => {
  const res = await server_fetch(`/api/media/${viewerId}/${listing}`);
  const shows: Media[] = await res.json();

  return (
    <div>
      <h1 className="text-2xl font-medium py-2">{title}</h1>
      {!shows.length && (
        <div className="flex text-zinc-500 text-sm bg-zinc-800 rounded-md p-8 items-center justify-center">
          Nothing to show
        </div>
      )}
      <div className="flex flex-col gap-4">
        {shows.map((show) => (
          <MediaItem
            key={show.id}
            media={show}
            canContinue={listing == "watching"}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaListing;
