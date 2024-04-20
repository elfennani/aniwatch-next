"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { EpisodeDetail } from "./ShowEpisodes";
import Link from "next/link";
import secondsToHms from "@/app/(authenticated)/lib/utils/secondsToHms";

type Props = {
  id: number;
  episode: string;
  details: EpisodeDetail;
  hasDub: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  active?: boolean;
};

const Episode = ({
  details,
  episode,
  hasDub,
  id,
  onClick,
  active = false,
}: Props) => {
  let thumbnail = details.thumbnails.filter((t) => !t.includes("cdnfile"))[0];
  if (!thumbnail.startsWith("http")) {
    thumbnail =
      "https://wp.youtube-anime.com/aln.youtube-anime.com" + thumbnail;
  }

  return (
    <li>
      <Link
        className="flex items-center gap-4 hover:bg-zinc-800 transition-colors rounded"
        href={`/show/${id}/sub/${episode}`}
        onClick={onClick}
      >
        <img
          src={thumbnail}
          alt={episode}
          width={124}
          className="rounded aspect-video"
        />
        <div>
          <h2>Episode {episode}</h2>
          <p className="text-xs mt-1 uppercase text-zinc-400">
            sub {hasDub && "• dub"}{" "}
            {active && (
              <span className="font-bold text-purple-500">
                • Currently Watching
              </span>
            )}
          </p>
          {details.vidInforssub && (
            <p className="text-xs mt-1 text-zinc-400">
              {secondsToHms(details.vidInforssub.vidDuration)} •{" "}
              {details.vidInforssub.vidResolution}p
            </p>
          )}
        </div>
      </Link>
    </li>
  );
};

export default Episode;
