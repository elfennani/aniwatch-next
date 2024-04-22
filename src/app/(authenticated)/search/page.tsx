"use client";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Icon from "@/components/iconify";
import { NextPage } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useSearchQuery from "@/hooks/use-search-query";
import MediaItem from "@/components/media-item";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError, error } = useSearchQuery(
    searchParams.get("query") ?? ""
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    router.push(pathname + "?" + createQueryString("query", e.target.value));

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
          value={searchParams.get("query") ?? ""}
          autoFocus
        />
      </div>
      <div>
        <div className="flex flex-col gap-4">
          {data?.map((show) => (
            <MediaItem key={show.id} media={show} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
