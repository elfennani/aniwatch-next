"use client";
import { ChangeEvent } from "react";
import Icon from "@/components/iconify";
import { NextPage } from "next";
import useSearchQuery from "@/hooks/use-search-query";
import MediaItem from "@/components/media-item";
import { useQueryState } from "nuqs";
import MediaListingSkeleton from "@/components/media-listing-skeleton";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const [query, setQuery] = useQueryState("query");
  const { data, isLoading, isError, error } = useSearchQuery(query || "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  return (
    <main className="p-8 flex flex-col gap-8">
      <div className="flex flex-1 items-center px-4 md:max-w-[512px] rounded bg-zinc-800">
        <Icon icon="tabler:search" fontSize={18} className="text-zinc-500" />
        <input
          type="search"
          name="anime-search"
          className="px-4 py-3 placeholder:italic placeholder:text-zinc-500 flex-1 bg-transparent outline-none"
          placeholder="Attack on Titan Season 2"
          onChange={handleChange}
          value={query ?? ""}
          autoFocus
        />
      </div>
      <div>
        {isLoading && <MediaListingSkeleton length={3} />}
        {data && (
          <>
            <h1 className="text-2xl font-medium py-2 mb-2">Results</h1>
            <div className="flex flex-col gap-4">
              {data?.map((show) => (
                <MediaItem key={show.id} media={show} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Page;
