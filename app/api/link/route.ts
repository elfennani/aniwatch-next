import useAllAnimeClient from "@/app/(authenticated)/lib/hooks/useAllAnimeClient";
import dycrept from '@/app/(authenticated)/lib/utils/decrypt'


interface QueryEpisode {
  episode: {
    episodeString: string;
    sourceUrls: { sourceUrl: string; sourceName: string }[];
  };
}

const query_episode = `
  query ($showId: String!, $translationType: VaildTranslationTypeEnumType!, $episodeString: String!) {
    episode(
      showId: $showId
      translationType: $translationType
      episodeString: $episodeString
    ) {
      episodeString
      sourceUrls
    }
  }
`;

const m3u8_providers = ["Luf-mp4", "Default"];
const mp4_providers = ["S-mp4", "Kir", "Sak"];

export const GET = async (request: Request) => {
  const client = useAllAnimeClient();
  const { searchParams } = new URL(request.url);
  const showId = searchParams.get("showId")
  const episode = searchParams.get("episode")

  const response: QueryEpisode = await client.request(query_episode, {
    showId,
    episodeString: episode,
    translationType: "sub",
  });

  const providers = response.episode.sourceUrls
    .filter((url) => m3u8_providers.includes(url.sourceName))
    .reduce(
      (prev, url) => ({
        ...prev,
        [url.sourceName]:
          "https://allanime.day" +
          url.sourceUrl
            .replace("--", "")
            .match(/.{1,2}/g)
            ?.map(dycrept)
            .join("")
            .replace("clock", "clock.json"),
      }),
      {} as Record<string, string>
    );

  let retries = 0;
  let json: any;
  while (retries < 3) {
    try {
      const res = await fetch(providers["Luf-mp4"]);
      json = await res.json();
      break;
    } catch (error) {
      retries++;
      await new Promise((res) => setTimeout(res, 100));
    }
  }
  const link = json.links[0].link;

  return Response.json({ link })
}