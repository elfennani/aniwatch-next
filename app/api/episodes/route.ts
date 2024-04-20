import useAllAnimeClient from "@/app/(authenticated)/lib/hooks/useAllAnimeClient";

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

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const showId = searchParams.get("showId")
  const max = Number(searchParams.get("max"))
  const client = useAllAnimeClient()

  const episodes: Episodes = await client.request(episodes_details_query, {
    showId,
    max,
  });

  return Response.json(episodes)
}