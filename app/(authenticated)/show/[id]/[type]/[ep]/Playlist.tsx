"use client";
import { Episodes } from "@/app/api/episodes/route";
import { useQuery } from "@tanstack/react-query";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import Player from "./Player";
import { Icon } from "@iconify/react/dist/iconify.js";
import Episode from "../../components/Episode";

type Props = {
  id: string;
  showId: string;
  episodes: Episodes;
  episode: string;
  availableEpisodes: {
    sub: string[];
    dub: string[];
  };
};

const fetchLink = async (showId: string, episode: string) => {
  const params = new URLSearchParams({ showId, episode }).toString();
  const res = await fetch(`/api/link?${params}`);
  const json = await res.json();

  return json.link as string;
};

const Playlist = ({
  episodes,
  showId,
  episode,
  id,
  availableEpisodes: { sub, dub },
}: Props) => {
  const [current, setCurrent] = useState(episode);
  const listRef = useRef<HTMLUListElement>(null);
  const { data } = useQuery({
    queryKey: ["show", showId, current],
    queryFn: () => fetchLink(showId, current),
  });

  useEffect(() => {
    listRef.current?.children[Number(current) - 1].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [current]);

  const handlePress: (ep: number) => MouseEventHandler<HTMLAnchorElement> =
    (ep) => (e) => {
      e.preventDefault();
      setCurrent(ep.toString());
      window.history.pushState(undefined, "", `/show/${id}/sub/${ep}`);
    };

  return (
    <div className="h-dvh flex flex-col">
      {data ? (
        <Player url={data} />
      ) : (
        <div className="aspect-video w-full bg-zinc-800 flex items-center justify-center">
          <Icon icon="tabler:loader" className="animate-spin" fontSize={48} />
        </div>
      )}
      <ul
        ref={listRef}
        className="flex flex-col gap-4 p-8 overflow-y-scroll h-full"
      >
        {sub.toReversed().map((ep) => {
          return (
            <Episode
              active={ep == current}
              onClick={handlePress(Number(ep))}
              key={ep}
              id={Number(id)}
              episode={ep}
              details={
                episodes.episodeInfos.find(
                  (episode) => episode.episodeIdNum == Number(ep)
                )!
              }
              hasDub={dub.includes(ep)}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Playlist;
