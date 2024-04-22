/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Player from "./Player";
import server_fetch from "@/utils/server-fetch";
import { ShowDetails } from "@/interfaces/ShowDetails";

interface Props {
  params: {
    id: string;
    ep: string;
  };
}
const WatchByIdPage: NextPage<Props> = async ({ params: { id, ep } }) => {
  const res = await server_fetch(`/api/show/${id}`);
  const show: ShowDetails = await res.json();

  const linkParams = new URLSearchParams({
    showId: show.allanimeId,
    episode: ep,
  }).toString();
  const linkRes = await server_fetch(`/api/link?${linkParams}`);
  const link = (await linkRes.json()).link;

  return <Player url={link} />;
};

export default WatchByIdPage;
