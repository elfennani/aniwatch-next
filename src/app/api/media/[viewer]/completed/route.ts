import Media from "@/interfaces/Media";
import AnilistServerClient from "@/utils/anilist-server-client";
import { graphql } from "gql.tada";

const completed_query = graphql(`
  query CompletedQuery($userId: Int!) {
    collection:MediaListCollection(
      userId: $userId
      type: ANIME
      status_in: [COMPLETED]
      sort: [FINISHED_ON_DESC]
    ) {
      lists {
        name
        entries {
          progress
          media {
            id
            title {
              userPreferred
            }
            episodes
            coverImage {
              large
            }
          }
        }
      }
    }
  }
`);

interface Params {
  params: { viewer: string }
}

export const GET = async (request: Request, { params: { viewer } }: Params) => {
  const client = AnilistServerClient()
  const response = await client.request(completed_query, { userId: Number(viewer) });

  const shows: Media[] = response.collection?.lists?.[0]?.entries?.map(entry => ({
    id: entry?.media?.id!,
    title: entry?.media?.title?.userPreferred!,
    cover: entry?.media?.coverImage?.large!,
    progress: entry?.progress!,
    episodes: entry?.media?.episodes!
  }))!

  return Response.json(shows)
}