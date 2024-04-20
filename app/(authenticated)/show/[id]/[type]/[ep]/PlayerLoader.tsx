import useAllAnimeClient from "@/app/(authenticated)/lib/hooks/useAllAnimeClient";
import React from "react";
import Player from "./Player";

type Props = {
  showId: string;
  episode: number;
};

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

const PlayerLoader = async ({ episode, showId }: Props) => {
  const client = useAllAnimeClient();
  const response: QueryEpisode = await client.request(query_episode, {
    showId,
    episodeString: episode.toString(),
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
            ?.map(replaceToText)
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

  return <Player url={link} />;
};

export default PlayerLoader;

const replaceToText = (string: string) => {
  if (string == "01") return "9";
  if (string == "08") return "0";
  if (string == "05") return "=";
  if (string == "0a") return "2";
  if (string == "0b") return "3";
  if (string == "0c") return "4";
  if (string == "07") return "?";
  if (string == "00") return "8";
  if (string == "5c") return "d";
  if (string == "0f") return "7";
  if (string == "5e") return "f";
  if (string == "17") return "/";
  if (string == "54") return "l";
  if (string == "09") return "1";
  if (string == "48") return "p";
  if (string == "4f") return "w";
  if (string == "0e") return "6";
  if (string == "5b") return "c";
  if (string == "5d") return "e";
  if (string == "0d") return "5";
  if (string == "53") return "k";
  if (string == "1e") return "&";
  if (string == "5a") return "b";
  if (string == "59") return "a";
  if (string == "4a") return "r";
  if (string == "4c") return "t";
  if (string == "4e") return "v";
  if (string == "57") return "o";
  if (string == "51") return "i";
  return string;
};
