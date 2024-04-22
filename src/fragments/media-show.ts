import { graphql } from "gql.tada";

const MediaShowFragment = graphql(`
  fragment MediaShow on Media{
    id
    title {
      userPreferred
    }
    episodes
    coverImage {
      large
    }
    mediaListEntry{
      progress
    }
  }
`)

export default MediaShowFragment