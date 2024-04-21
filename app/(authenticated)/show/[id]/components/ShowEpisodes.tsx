/* eslint-disable @next/next/no-img-element */
import useAllAnimeClient from "@/app/(authenticated)/lib/hooks/useAllAnimeClient";
import { AllAnimeShow } from "@/app/api/show/[id]/route";
import { cookies } from "next/headers";
import Episode from "./Episode";

type Props = {
  id: number;
  currentEpisode?: number;
};

export interface EpisodeDetail {
  _id: string;
  episodeIdNum: number;
  thumbnails: string[];
  vidInforssub: {
    vidResolution: number;
    vidPath: string;
    vidSize: number;
    vidDuration: number;
  };
}

interface Episodes {
  episodeInfos: EpisodeDetail[];
}

const episodes_details_query = `
  query($showId: String!, $max: Float!) {
    episodeInfos(showId:$showId,  episodeNumStart:0, episodeNumEnd:$max){
      _id
      thumbnails
      episodeIdNum
      vidInforssub
    }
  }
`;

const ShowEpisodes = async ({ id, currentEpisode }: Props) => {
  const client = useAllAnimeClient();
  const res = await fetch(`${process.env.URL}/api/show/${id}`, {
    headers: { Cookie: cookies().toString() },
  });
  const show: AllAnimeShow = await res.json();
  const episodes: Episodes = await client.request(episodes_details_query, {
    showId: show._id,
    max: show.availableEpisodesDetail.sub.length + 1,
  });

  return (
    <ul className="flex flex-col-reverse gap-4">
      {show.availableEpisodesDetail.sub.map((ep) => (
        <Episode
          active={currentEpisode == Number(ep)}
          key={ep}
          id={id}
          episode={ep}
          details={
            episodes.episodeInfos.find(
              (episode) => episode.episodeIdNum == Number(ep)
            )!
          }
          hasDub={show.availableEpisodesDetail.dub.includes(ep)}
        />
      ))}
    </ul>
  );
};

export default ShowEpisodes;
