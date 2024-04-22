/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Player from "./Player";
import server_fetch from "@/utils/server-fetch";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { redirect } from "next/navigation";
import { twJoin, twMerge } from "tailwind-merge";
import Link from "next/link";

interface Props {
  params: {
    id: string;
    ep: string;
    type: "sub" | "dub";
  };
}
const WatchByIdPage: NextPage<Props> = async ({ params: { id, ep, type } }) => {
  const res = await server_fetch(`/api/show/${id}`);
  const show: ShowDetails = await res.json();

  if (!["sub", "dub"].includes(type)) redirect("/");

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
