/* eslint-disable @next/next/no-img-element */
"use client";
import { NextPage } from "next";
import { signout } from "./actions";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "next-client-cookies";
import { GraphQLClient } from "graphql-request";
import { graphql } from "gql.tada";
import Link from "next/link";

interface Props {}

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

async function search(query: string, token: string) {
  if (!query.trim()) return [];

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  const client = new GraphQLClient("https://graphql.anilist.co", { headers });
  const res = await client.request(search_query, { query });

  return res.anime?.media;
}

const HomePage: NextPage<Props> = ({}) => {
  const cookies = useCookies();
  const [searchQuery, setSearchQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const { data } = useQuery({
    queryKey: ["anime-search", debounced],
    queryFn: () => search(debounced, cookies.get("token")!!),
  });

  useEffect(() => {
    const effect = setTimeout(() => setDebounced(searchQuery), 500);

    return () => clearTimeout(effect);
  }, [searchQuery]);

  useEffect(() => console.log(data), [data]);

  return (
    <div className="flex flex-col p-8 gap-4">
      <header className="flex max-md:flex-col gap-4 justify-between self-stretch">
        <h1 className="text-3xl">Home Page</h1>

        <input
          type="search"
          name="anime-search"
          className="border border-zinc-300 px-4 py-2 placeholder:italic flex-1 md:max-w-[512px] rounded"
          placeholder="Attack on Titan Season 2"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <button
          className="bg-blue-400 text-white px-3 py-2 text-sm font-medium rounded"
          onClick={() => signout()}
        >
          Logout
        </button>
      </header>
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {data?.map((media) => (
          <Link
            key={media?.id}
            className="flex flex-col gap-2"
            href={`/show/${media?.id}`}
          >
            <img
              className="flex-1 object-cover rounded-md"
              src={media?.coverImage?.large!!}
              alt={media?.title?.userPreferred!!}
            />
            <h2 className="line-clamp-1">{media?.title?.userPreferred}</h2>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
