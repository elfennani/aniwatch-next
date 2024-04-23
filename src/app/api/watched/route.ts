import AnilistServerClient from "@/utils/anilist-server-client";
import { graphql } from "gql.tada"

interface Body {
  episode: number
  show: number
}

const mutation = graphql(`
  mutation UPDATE_PROGRESS($progress:Int,$mediaId:Int){
    SaveMediaListEntry(mediaId: $mediaId, progress: $progress){
      id
    }
  }
`);

export const POST = async (request: Request) => {
  const { episode, show: showId }: Body = await request.json()
  const client = AnilistServerClient();

  await client.request(mutation, { mediaId: showId, progress: episode })

  return new Response(null, { status: 204 })
}