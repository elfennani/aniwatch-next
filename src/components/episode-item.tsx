/* eslint-disable @next/next/no-img-element */
"use client";
import { Episode } from "@/interfaces/Episode";
import secondsToHms from "@/utils/seconds-to-hms";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

type Props = {
  id: number;
  details: Episode;
};

const EpisodeItem = ({
  details: { thumbnail, number, dub, duration, resolution },
  id,
}: Props) => {
  const listElementRef = useRef<HTMLLIElement>(null);
  const { ep } = useParams<{ ep: string }>();
  const active = Number(ep) == number;

  useEffect(() => {
    if (Number(ep) == number) {
      listElementRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [ep, number]);

  return (
    <li ref={listElementRef}>
      <Link
        className="flex items-center gap-4 hover:bg-zinc-800 transition-colors rounded"
        href={`/show/${id}/sub/${number}`}
      >
        <img
          src={thumbnail}
          alt={number.toString()}
          width={124}
          className="rounded aspect-video"
        />
        <div>
          <h2>Episode {number}</h2>
          <p className="text-xs mt-1 uppercase text-zinc-400">
            sub {dub && "• dub"}{" "}
            {active && (
              <span className="font-bold text-purple-500">
                • Currently Watching
              </span>
            )}
          </p>
          <p className="text-xs mt-1 text-zinc-400">
            {!!duration && secondsToHms(duration)}
            {!!duration && !!resolution && " • "}
            {!!resolution && `${resolution}p`}
          </p>
        </div>
      </Link>
    </li>
  );
};

export default EpisodeItem;
