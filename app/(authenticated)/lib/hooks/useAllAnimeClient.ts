import { GraphQLClient } from "graphql-request";
import { useCookies } from "next-client-cookies"

const useAllAnimeClient = () => {
  const headers = new Headers();
  headers.append("Referer", "https://allanime.to")
  headers.append("Agent", 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0')

  return new GraphQLClient("https://api.allanime.day/api", { headers })
}

export default useAllAnimeClient