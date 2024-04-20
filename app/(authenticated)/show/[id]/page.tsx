/* eslint-disable @next/next/no-img-element */
import { graphql } from "gql.tada";
import { GraphQLClient } from "graphql-request";
import { NextPage } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import useAniListClient from "../../lib/hooks/useAniListClient.server";
import stc from "string-to-color";
import ShowEpisodes from "./components/ShowEpisodes";

interface Props {
  params: {
    id: string;
  };
}

const show_query = graphql(`
  query ShowById($id: Int) {
    show: Media(id: $id) {
      id
      coverImage {
        extraLarge
      }
      bannerImage
      title {
        userPreferred
      }
      description
      seasonYear
      type
      episodes
      genres
    }
  }
`);

const ShowById: NextPage<Props> = async ({ params: { id } }) => {
  const client = useAniListClient();
  const { show } = await client.request(show_query, { id: Number(id) });

  return (
    <main>
      <header className="relative p-8">
        <img
          src={show?.bannerImage!}
          alt={show?.title?.userPreferred!}
          className="absolute top-0 left-0 w-full h-full object-cover -z-20"
        />
        <div className="-z-10 absolute top-0 left-0 w-full h-full bg-gradient-to-t from-zinc-900 to-transparent" />
        <div className="-z-10 absolute top-0 left-0 w-full h-full bg-zinc-900 bg-opacity-20" />
        <div className="flex">
          <img
            className="w-32 rounded"
            src={show?.coverImage?.extraLarge!}
            alt={show?.title?.userPreferred!}
          />
          <div className="flex-1 p-4 pr-0 flex flex-col gap-1.5 justify-end">
            <h1 className="font-medium text-lg leading-none">
              {show?.title?.userPreferred}
            </h1>
            <p className="text-xs opacity-80">{show?.seasonYear}</p>
            <p className="text-xs opacity-80">
              {show?.type} • {show?.episodes} Episodes
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {show?.genres?.map((genre) => (
            <span
              key={genre}
              style={{ backgroundColor: stc(genre) }}
              className="py-1 px-2 text-xs rounded font-semibold"
            >
              {genre}
            </span>
          ))}
        </div>
      </header>
      <section className="px-8 py-4">
        <h2 className="text-sm font-semibold mb-4">Synopsis</h2>
        <p
          className="text-sm leading-snug"
          dangerouslySetInnerHTML={{ __html: show?.description ?? "" }}
        />
      </section>
      <section className="px-8 py-8">
        <h2 className="text-sm font-semibold mb-4">Episodes</h2>
        <ShowEpisodes id={Number(id)} />
      </section>
    </main>
  );
};

export default ShowById;
