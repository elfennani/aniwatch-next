/* eslint-disable react/no-children-prop */
/* eslint-disable @next/next/no-img-element */
import { Metadata, NextPage } from "next";
import Player from "../../../../../../components/player";
import server_fetch from "@/utils/server-fetch";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { cache } from "react";
import Title from "@/components/title-setter-client";

interface Props {
  params: {
    id: string;
    ep: string;
    type: "sub" | "dub";
  };
}

const fetchShow = cache(async (id: number) => {
  const res = await server_fetch(`/api/show/${id}`);
  const show: ShowDetails = await res.json();

  return show;
});

const WatchByIdPage: NextPage<Props> = async ({ params: { id, ep, type } }) => {
  if (!["sub", "dub"].includes(type)) redirect("/");

  const show = await fetchShow(Number(id));

  if (
    !show.episodes.find((episode) => episode.number == Number(ep))?.dub &&
    type == "dub"
  ) {
    redirect(process.env.URL + `/watch/${id}/sub/${ep}`);
  }

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

  const nextEpisode = show.episodes.find((episode) => {
    return episode.number == Number(ep) + 1;
  });

  return (
    <div>
      <Title children={`${show.title} • Ep. ${ep} • AniWatch`} />
      <Player
        url={link}
        isDubbed={dubbed ?? false}
        watched={(show.progress ?? 0) >= Number(ep)}
        nextEpisode={nextEpisode}
      />
    </div>
  );
};

export default WatchByIdPage;
