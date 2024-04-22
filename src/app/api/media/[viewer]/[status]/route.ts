import MediaShowFragment from "@/fragments/media-show";
import Media from "@/interfaces/Media";
import AnilistServerClient from "@/utils/anilist-server-client";
import { graphql, readFragment } from "gql.tada";

const completed_query = graphql(`
  query CompletedQuery($userId: Int!,$status: MediaListStatus) {
    collection:MediaListCollection(
      userId: $userId
      type: ANIME
      status_in: [$status]
      sort: [FINISHED_ON_DESC]
    ) {
      lists {
        name
        entries {
          media {
            ...MediaShow
          }
        }
      }
    }
  }
`, [MediaShowFragment]);

interface Params {
  params: { viewer: string, status: "watching" | "completed" }
}

export const GET = async (request: Request, { params: { viewer, status } }: Params) => {
  const client = AnilistServerClient()
  const statusMapping = {
    watching: "CURRENT",
    completed: "COMPLETED"
  } as const

  const response = await client.request(completed_query, {
    userId: Number(viewer),
    status: statusMapping[status]
  });

  const shows: Media[] = response.collection?.lists?.[0]?.entries?.map((entry) => {
    const media = readFragment(MediaShowFragment, entry?.media)
    return ({
      id: media?.id!,
      title: media?.title?.userPreferred!,
      cover: media?.coverImage?.large!,
      progress: media?.mediaListEntry?.progress!,
      episodes: media?.episodes!
    });
  })!

  return Response.json(shows)
}