import { useQuery } from "@tanstack/react-query";
import { graphql } from "gql.tada";
import { GraphQLClient } from "graphql-request";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";
import useAniListClient from "./useAniListClient.client";

const search_query = graphql(`
  query SeachQuery($query: String) {
    anime: Page(perPage: 8) {
      media(type: ANIME, search: $query, isAdult: false) {
        id
        title {
          userPreferred
        }
        coverImage {
          large
        }
      }
    }
  }
`);

async function search(query: string, client: GraphQLClient) {
  if (!query.trim()) return [];
  const res = await client.request(search_query, { query });

  return res.anime?.media;
}

const useSearchQuery = (searchQuery: string, delayInMs: number = 300) => {
  const cookies = useCookies();
  const client = useAniListClient()

  const [debounced, setDebounced] = useState("");
  const query = useQuery({
    queryKey: ["anime-search", debounced],
    queryFn: () => search(debounced, client),
  });

  useEffect(() => {
    const effect = setTimeout(() => setDebounced(searchQuery), delayInMs);

    return () => clearTimeout(effect);
  }, [searchQuery, delayInMs]);

  return query;
}

export default useSearchQuery