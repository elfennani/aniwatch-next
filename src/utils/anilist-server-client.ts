import { GraphQLClient } from "graphql-request";
import { cookies } from "next/headers";
import "server-only"

const AnilistServerClient = (token: string = cookies().get("token")?.value!!) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  const client = new GraphQLClient("https://graphql.anilist.co", { headers });
  return client
}

export default AnilistServerClient