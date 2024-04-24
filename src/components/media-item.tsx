"use client";
/* eslint-disable @next/next/no-img-element */
import Icon from "@/components/iconify";
import Media from "@/interfaces/Media";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

interface Props {
  canContinue?: boolean;
  media: Media;
}

const MediaItem = ({
  media: { cover, episodes, id, progress, title },
  canContinue = false,
}: Props) => {
  const translation = useMemo(() => {
    if (typeof localStorage === "undefined") return "sub";
    const type = localStorage.getItem("translation") as "sub" | "dub" | null;

    return type || "sub";
  }, []);

  return (
    <div key={id} className="flex bg-zinc-800 rounded-md overflow-hidden">
      <Link href={`/media/${id}`}>
        <img src={cover} alt={title} className="h-32" />
      </Link>
      <div className="p-4 flex flex-col justify-between flex-1">
        <Link href={`/media/${id}`}>{title}</Link>
        <div className="flex w-full justify-between items-end">
          {!!progress && (
            <p className="text-xs text-zinc-500">
              ({progress}/{episodes})
            </p>
          )}
          {canContinue && (
            <Link
              className="text-purple-500 text-sm underline flex items-center gap-2 active:text-purple-800"
              href={`/watch/${id}/${translation}/${progress + 1}`}
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
