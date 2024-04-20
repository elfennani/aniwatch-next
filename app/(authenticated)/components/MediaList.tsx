/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { graphql } from "gql.tada";
import { useQuery } from "@tanstack/react-query";
import useAniListClient from "../lib/hooks/useAniListClient.client";
import { GraphQLClient } from "graphql-request";
import MediaListSkeleton from "./MediaListSkeleton";

type Props = {};

const view_query = graphql(`
  query ViewerQuery {
    Viewer {
      id
    }
  }
`);

const home_query = graphql(`
  query HomeQuery($userId: Int!) {
    MediaListCollection(
      userId: $userId
      type: ANIME
      status_in: [CURRENT, COMPLETED]
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

async function fetchHomeData(client: GraphQLClient) {
  const viewerResponse = await client.request(view_query);
  const userId = viewerResponse.Viewer?.id!!;

  const response = await client.request(home_query, { userId });

  return response;
}

const MediaList = (props: Props) => {
  const client = useAniListClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["medialist"],
    queryFn: () => fetchHomeData(client),
  });

  const sort = (a: any, b: any) => {
    if (a?.name == "Watching") return -1;
    if (b?.name == "Watching") return 1;
    return 0;
  };

  if (isLoading) {
    return <MediaListSkeleton />;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {data!.MediaListCollection?.lists?.sort(sort)?.map((list) => (
        <section key={list?.name}>
          <h2 className="text-xl uppercase font-semibold text-slate-500 mb-2">
            {list?.name}
          </h2>
          <div className="flex flex-col gap-2">
            {list?.entries?.map((entry) => (
              <div
                key={entry?.media?.id}
                className="flex bg-zinc-800 rounded-md overflow-hidden"
              >
                <Link href={`/show/${entry?.media?.id}`}>
                  <img
                    src={entry?.media?.coverImage?.large!!}
                    alt={entry?.media?.title?.userPreferred!!}
                    className="h-32"
                  />
                </Link>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <Link href={`/show/${entry?.media?.id}`}>
                    {entry?.media?.title?.userPreferred}
                  </Link>
                  <div className="flex w-full justify-between items-end">
                    <p className="text-xs text-zinc-500">
                      ({entry?.progress}/{entry?.media?.episodes})
                    </p>
                    {list.name == "Watching" && (
                      <Link
                        href={`/show/${entry?.media?.id}/sub/${
                          entry?.progress!! + 1
                        }`}
                        className="text-purple-500 text-sm underline flex items-center gap-2 active:text-purple-800"
                      >
                        <Icon icon="tabler:player-play-filled" />
                        Continue Watching
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MediaList;
