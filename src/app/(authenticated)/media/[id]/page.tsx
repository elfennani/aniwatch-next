/* eslint-disable @next/next/no-img-element */
import { Metadata, NextPage } from "next";
import stc from "string-to-color";
import server_fetch from "@/utils/server-fetch";
import { ShowDetails } from "@/interfaces/ShowDetails";
import EpisodeItem from "@/components/episode-item";
import { cache } from "react";
import { stripHtml } from "string-strip-html";
import Title from "@/components/title-setter-client";
import Link from "next/link";
import { twJoin } from "tailwind-merge";
import { headers } from "next/headers";
import TagsGrid from "@/components/tags-grid";

interface Props {
  params: {
    id: string;
  };
}

const fetchShow = cache(async (id: string) => {
  const res = await server_fetch(`/api/show/${id}`);
  const show: ShowDetails = await res.json();

  return show;
});

const ShowById: NextPage<Props> = async ({ params: { id } }) => {
  const show = await fetchShow(id);

  return (
    <main>
      <Title>{`${show.title} • AniWatch`}</Title>
      <header className="relative p-8">
        {show.banner && (
          <img
            src={show.banner}
            alt={show.title}
            className="absolute top-0 left-0 w-full h-full object-cover -z-20"
          />
        )}
        <div className="-z-10 absolute top-0 left-0 w-full h-full bg-gradient-to-t from-zinc-900" />
        <div className="-z-10 absolute top-0 left-0 w-full h-full bg-zinc-900 bg-opacity-20" />
        <div className="flex">
          <img className="w-32 rounded" src={show.cover} alt={show.title} />
          <div className="flex-1 p-4 pr-0 flex flex-col gap-1.5 justify-end">
            <h1 className="font-medium text-lg leading-none">{show.title}</h1>
            <p className="text-xs opacity-80">{show.year}</p>
            <p className="text-xs opacity-80">
              {show.type} • {show.episodesCount} Episodes
            </p>
          </div>
        </div>
        {!!show.genres && (
          <div className="flex flex-wrap gap-2 mt-4">
            {show.genres.map((genre) => (
              <span
                key={genre}
                style={{ backgroundColor: stc(genre) }}
                className="py-1 px-2 text-xs rounded font-semibold"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </header>
      <section className="px-8 py-4">
        <h2 className="text-sm font-semibold mb-4">Synopsis</h2>
        <p
          className="text-sm leading-snug text-zinc-100"
          dangerouslySetInnerHTML={{ __html: show?.description ?? "" }}
        />
      </section>
      <section className="px-8 py-4">
        <h2 className="text-sm font-semibold mb-4">Relations</h2>
        <ul className="flex flex-col gap-4">
          {show.relations.map((media) => (
            <li key={media.id}>
              <Link
                href={`/media/${media.id}`}
                className={twJoin(
                  "flex",
                  media.type == "MANGA" && "pointer-events-none"
                )}
              >
                <img
                  src={media.cover}
                  alt={media.title}
                  className="w-20 rounded"
                />
                <div className="px-4 py-2 text-zinc-200">
                  <h3>{media.title}</h3>
                  <p className="capitalize text-xs text-zinc-300 mt-2">
                    {media.relationType.replaceAll("_", " ").toLowerCase()}
                    {" • "}
                    {media.type.toLowerCase()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {show.tags && <TagsGrid tags={show.tags} />}
      {show.episodes && (
        <section className="px-8 py-8">
          <h2 className="text-sm font-semibold mb-4">Episodes</h2>
          <ul className="flex flex-col-reverse gap-4">
            {show.episodes.map((episode) => (
              <EpisodeItem key={episode.id} id={show.id} details={episode} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default ShowById;
