/* eslint-disable @next/next/no-img-element */
import Icon from "@/components/iconify";
import Media from "@/interfaces/Media";
import Link from "next/link";
import React from "react";

interface Props {
  canContinue?: boolean;
  media: Media;
}

const MediaItem = ({
  media: { cover, episodes, id, progress, title },
  canContinue = false,
}: Props) => {
  return (
    <div key={id} className="flex bg-zinc-800 rounded-md overflow-hidden">
      <Link href={`/show/${id}`}>
        <img src={cover} alt={title} className="h-32" />
      </Link>
      <div className="p-4 flex flex-col justify-between flex-1">
        <Link href={`/show/${id}`}>{title}</Link>
        <div className="flex w-full justify-between items-end">
          <p className="text-xs text-zinc-500">
            ({progress}/{episodes})
          </p>
          {canContinue && (
            <Link
              className="text-purple-500 text-sm underline flex items-center gap-2 active:text-purple-800"
              href={`/show/${id}/sub/${progress + 1}`}
            >
              <Icon icon="tabler:player-play-filled" />
              Continue Watching
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaItem;
