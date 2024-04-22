import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";
import useAniListClient from "./use-anilist-client";
import Media from "@/interfaces/Media";


async function search(query: string) {
  if (!query.trim()) return [];
  const params = new URLSearchParams({ query }).toString()
  const res = await fetch(`/api/search?${params}`);
  const media: Media[] = await res.json();

  return media;
}

const useSearchQuery = (searchQuery: string, delayInMs: number = 300) => {
  const [debounced, setDebounced] = useState("");
  const query = useQuery({
    queryKey: ["anime-search", debounced],
    queryFn: () => search(debounced),
  });

  useEffect(() => {
    const effect = setTimeout(() => setDebounced(searchQuery), delayInMs);

    return () => clearTimeout(effect);
  }, [searchQuery, delayInMs]);

  return query;
}

export default useSearchQuery