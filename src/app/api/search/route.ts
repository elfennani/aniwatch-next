import MediaShowFragment from "@/fragments/media-show";
import Media from "@/interfaces/Media";
import AnilistServerClient from "@/utils/anilist-server-client";
import { graphql, readFragment } from "gql.tada";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const client = AnilistServerClient()

  if (!query)
    return Response.json({ error: "`query` can't be empty" }, { status: 500 })

  const result = await client.request(search_query, { query })
  const media: Media[] = result.anime?.media?.map(medium => {
    const show = readFragment(MediaShowFragment, medium)
    return ({
      id: show?.id!,
      cover: show?.coverImage?.large!,
      episodes: show?.episodes!,
      progress: show?.mediaListEntry?.progress!,
      title: show?.title?.userPreferred!
    });
  }) ?? []

  return Response.json(media)
}

const search_query = graphql(`
  query SeachQuery($query: String) {
    anime: Page(perPage: 8) {
      media(
        type: ANIME,
        search: $query,
        isAdult: false,
        sort: POPULARITY_DESC) {
        ...MediaShow
      }
    }
  }
`, [MediaShowFragment]);