/* eslint-disable @next/next/no-img-element */
import Thumbnail from "@/app/(authenticated)/components/Thumbnail";
import useAllAnimeClient from "@/app/(authenticated)/lib/hooks/useAllAnimeClient";
import secondsToHms from "@/app/(authenticated)/lib/utils/secondsToHms";
import { AllAnimeShow } from "@/app/api/show/[id]/route";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

type Props = {
  id: number;
};

interface EpisodeDetail {
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

const ShowEpisodes = async ({ id }: Props) => {
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
    <ul className="flex flex-col gap-4">
      {show.availableEpisodesDetail.sub.reverse().map((ep) => {
        const details = episodes.episodeInfos.find(
          (episode) => episode.episodeIdNum == Number(ep)
        )!;
        let thumbnail = details.thumbnails.filter(
          (t) => !t.includes("cdnfile")
        )[0];
        if (!thumbnail.startsWith("http")) {
          thumbnail =
            "https://wp.youtube-anime.com/aln.youtube-anime.com" + thumbnail;
        }

        return (
          <li key={ep}>
            <Link
              className="flex items-center gap-4 hover:bg-zinc-800 transition-colors rounded"
              href={`/show/${id}/sub/${ep}`}
            >
              <img
                src={thumbnail}
                alt={ep}
                width={124}
                className="rounded aspect-video"
              />
              <div>
                <h2>Episode {ep}</h2>
                <p className="text-xs mt-1 uppercase opacity-50">
                  sub {show.availableEpisodesDetail.dub.includes(ep) && "• dub"}
                </p>
                {details.vidInforssub && (
                  <p className="text-xs mt-1 opacity-50">
                    {secondsToHms(details.vidInforssub.vidDuration)} •{" "}
                    {details.vidInforssub.vidResolution}p
                  </p>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default ShowEpisodes;
