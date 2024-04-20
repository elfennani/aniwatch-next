import useAllAnimeClient from "@/app/(authenticated)/lib/hooks/useAllAnimeClient";
import useAniListClient from "@/app/(authenticated)/lib/hooks/useAniListClient.server";
import { graphql } from "gql.tada";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const allanime = useAllAnimeClient();
  const anilist = useAniListClient();
  const id = Number(params.id)

  const media = await anilist.request(media_query, { id });
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
    (show) => show.aniListId == id
  );

  return Response.json(show)
}

export type AllAnimeShow = ShowQuery["shows"]["edges"][0]

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