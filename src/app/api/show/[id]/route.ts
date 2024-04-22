import { ShowDetails } from "@/interfaces/ShowDetails";
import AllAnimeClient from "@/utils/allanime-client";
import AnilistServerClient from "@/utils/anilist-server-client";
import { graphql } from "gql.tada";
import { NextResponse } from "next/server";
import { retry } from "ts-retry-promise";

interface Params {
  params: { id: string }
}

export const GET = async (request: Request, { params: { id: idString } }: Params) => {
  const allanime = AllAnimeClient();
  const anilist = AnilistServerClient();
  const id = Number(idString)

  const { media } = await anilist.request(media_query, { id });

  const search = media?.title?.userPreferred
  const showSearch: ShowQuery = await retry(
    () => allanime.request(show_query, { search }),
    { retries: 3 }
  )
  const show = showSearch!!.shows.edges?.find(
    (show) => show.aniListId == id
  );

  if (!show) {
    return Response.json({ error: "Failed to find allanime show" }, { status: 404 })
  }

  const showId = show._id
  const max = show.availableEpisodesDetail.sub.length

  const episodes: Episodes = await retry(
    () => allanime.request(episodes_details_query, { showId, max }),
    { retries: 3 }
  );

  const showDetails: ShowDetails = {
    id,
    allanimeId: showId,
    title: media?.title?.userPreferred!,
    banner: media?.bannerImage!,
    cover: media?.coverImage?.extraLarge!,
    description: media?.description!,
    genres: (media?.genres as string[] | undefined) ?? [],
    progress: media?.mediaListEntry?.progress ?? undefined,
    episodesCount: media?.episodes ?? NaN,
    type: media?.type!,
    year: media?.seasonYear!,
    episodes: episodes.episodeInfos.map(ep => ({
      id: ep._id,
      number: ep.episodeIdNum,
      dub: show.availableEpisodesDetail.dub.includes(String(ep.episodeIdNum)),
      duration: ep.vidInforssub?.vidDuration,
      resolution: ep.vidInforssub?.vidResolution,
      thumbnail: ep.thumbnails
        .filter((t) => !t.includes("cdnfile"))
        .map(t => t.startsWith("http") ? t : (source + t))[0]
    }))
  }

  return NextResponse.json(showDetails)
}

// Thumbnail source for the ones without domain in them
const source = "https://wp.youtube-anime.com/aln.youtube-anime.com"

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
    media:Media(id: $id, type: ANIME) {
      id
      genres
      episodes
      description
      bannerImage
      type
      seasonYear
      title {
        userPreferred
      }
      coverImage {
        extraLarge
      }
      mediaListEntry{
        progress
      }
    }
  }
`);

interface EpisodeDetail {
  _id: string;
  episodeIdNum: number;
  thumbnails: string[];
  vidInforssub?: {
    vidResolution: number;
    vidPath: string;
    vidSize: number;
    vidDuration: number;
  };
}

export interface Episodes {
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