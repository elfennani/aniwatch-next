import Viewer from "@/interfaces/Viewer";
import AnilistServerClient from "@/utils/anilist-server-client";
import { graphql } from "gql.tada";
import { cookies } from "next/headers";

const view_query = graphql(`
  query ViewerQuery {
    user:Viewer {
      id
      avatar{medium}
      name
      about
    }
  }
`);

export const GET = async () => {
  const client = AnilistServerClient()
  const res = await client.request(view_query);

  if (!res.user) {
    return Response.json({ error: "Viewer not found" }, { status: 404 })
  }

  const { about, avatar, id, name } = res.user

  const viewer: Viewer = {
    id,
    name,
    about: about ?? undefined,
    avatar: avatar?.medium ?? undefined
  }

  return Response.json(viewer)
}