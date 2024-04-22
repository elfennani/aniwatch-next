/* eslint-disable @next/next/no-img-element */
import { Metadata, NextPage } from "next";
import Player from "./Player";
import server_fetch from "@/utils/server-fetch";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { cache } from "react";

interface Props {
  params: {
    id: string;
    ep: string;
    type: "sub" | "dub";
  };
}

export const generateMetadata = async ({
  params: { id, ep, type },
}: Props): Promise<Metadata> => {
  const show = await fetchShow(Number(id));

  return {
    title: `${show.title} • Ep. ${ep}`,
    openGraph: {
      title: `${show.title} • Ep. ${ep}`,
      type: "video.episode",
      images: show.episodes.find((episode) => episode.number == Number(ep))!
        .thumbnail,
      url: `${process.env.URl}/watch/${id}/${type}/${ep}`,
      siteName: "AniWatch",
    },
  };
};

const fetchShow = cache(async (id: number) => {
  const res = await server_fetch(`/api/show/${id}`);
  const show: ShowDetails = await res.json();

  return show;
});

const WatchByIdPage: NextPage<Props> = async ({ params: { id, ep, type } }) => {
  if (!["sub", "dub"].includes(type)) redirect("/");

  const show = await fetchShow(Number(id));

  const linkParams = new URLSearchParams({
    showId: show.allanimeId,
    episode: ep,
    type,
  }).toString();
  const linkRes = await server_fetch(`/api/link?${linkParams}`);
  const link = (await linkRes.json()).link;

  const dubbed = show.episodes.find(
    (episode) => episode.number == Number(ep)
  )?.dub;

  return (
    <div>
      <Player url={link} />
      {dubbed && (
        <div className="flex">
          <Link
            href={`/watch/${id}/sub/${ep}`}
            className={twMerge(
              "flex flex-1 items-center justify-center h-12 font-medium text-sm text-zinc-500",
              type == "sub" && "bg-purple-500 text-white pointer-events-none"
            )}
          >
            SUB
          </Link>
          <Link
            href={`/watch/${id}/dub/${ep}`}
            className={twMerge(
              "flex flex-1 items-center justify-center h-12 font-medium text-sm text-zinc-500",
              type == "dub" && "bg-purple-500 text-white pointer-events-none"
            )}
          >
            DUB
          </Link>
        </div>
      )}
    </div>
  );
};

export default WatchByIdPage;
