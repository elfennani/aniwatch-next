import AllAnimeClient from "@/utils/allanime-client";
import dycrept from "@/utils/decrypt";
import { retry } from "ts-retry-promise";


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
  const client = AllAnimeClient();
  const { searchParams } = new URL(request.url);
  const showId = searchParams.get("showId")
  const episode = searchParams.get("episode")

  const response: QueryEpisode = await retry(
    () => client.request(query_episode, {
      showId,
      episodeString: episode,
      translationType: "sub",
    }),
    { retries: 3 }
  );

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

  const link = await retry(async () => {
    const res = await fetch(providers["Luf-mp4"]);
    const json = await res.json();
    const link = json.links[0].link;

    return link
  }, { retries: 3 });

  return Response.json({ link })
}