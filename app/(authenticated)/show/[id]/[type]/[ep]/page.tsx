/* eslint-disable @next/next/no-img-element */
import { graphql } from "gql.tada";
import { NextPage } from "next";
import { redirect } from "next/navigation";
import useAllAnimeClient from "@/app/(authenticated)/lib/hooks/useAllAnimeClient";
import useAniListClient from "@/app/(authenticated)/lib/hooks/useAniListClient.server";
import Player from "./Player";

interface Props {
  params: {
    id: string;
    ep: string;
  };
}

interface ShowQuery {
  shows: {
    edges: [
      {
        _id: string;
        aniListId: number;
        availableEpisodesDetail: {
          sub: string[];
          dub: string[];
          raw: string[];
        };
      }
    ];
  };
}

const show_query = `
  query($search: String) {
    shows(
        search: {
          query: $search
        }
        page: 1
      ) {
        edges {
          _id
          aniListId
          availableEpisodesDetail
        }
      }
  }
`;

const media_query = graphql(`
  query GetMedia($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        userPreferred
      }
    }
  }
`);

const WatchByIdPage: NextPage<Props> = async ({ params: { id, ep } }) => {
  const allanime = useAllAnimeClient();
  const anilist = useAniListClient();
  const URL = process.env.URL;

  const media = await anilist.request(media_query, { id: Number(id) });
  let showSearch: ShowQuery;
  let retries = 0;

  while (retries < 3) {
    try {
      showSearch = await allanime.request(show_query, {
        search: media.Media?.title?.userPreferred,
      });
      break;
    } catch (error) {
      retries++;
      await new Promise((res) => setTimeout(res, 100));
    }
  }
  const show = showSearch!!.shows.edges?.find(
    (show) => show.aniListId == Number(id)
  );

  if (!show) redirect("/");

  const params = new URLSearchParams({
    showId: show._id,
    max: (show.availableEpisodesDetail.sub.length + 1).toString(),
  }).toString();

  const res = await fetch(`${URL}/api/episodes?${params}`);
  const episodes = await res.json();

  const linkParams = new URLSearchParams({
    showId: show._id,
    episode: ep,
  }).toString();
  const linkRes = await fetch(`${URL}/api/link?${linkParams}`);
  const link = (await linkRes.json()).link;

  return <Player url={link} />;
};

export default WatchByIdPage;
