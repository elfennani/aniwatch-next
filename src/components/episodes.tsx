import { ShowDetails } from "@/interfaces/ShowDetails";
import React from "react";
import EpisodeItem from "./episode-item";
import server_fetch from "@/utils/server-fetch";

type Props = {
  id: number;
};

const Episodes = async ({ id }: Props) => {
  const res = await server_fetch(`/api/show/${id}`);
  const show: ShowDetails = await res.json();

  return (
    <div>
      <ul className="flex flex-col-reverse gap-4">
        {show.episodes.map((episode) => (
          <EpisodeItem key={episode.id} id={show.id} details={episode} />
        ))}
      </ul>
    </div>
  );
};

export default Episodes;
