import { GraphQLClient } from "graphql-request";
import { useCookies } from "next-client-cookies"

const useAniListClient = () => {
  const cookies = useCookies()
  const token = cookies.get("token")!!

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  const client = new GraphQLClient("https://graphql.anilist.co", { headers });
  return client
}

export default useAniListClient