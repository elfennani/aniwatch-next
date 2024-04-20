/* eslint-disable @next/next/no-img-element */
"use client";
import { NextPage } from "next";
import { signout } from "./actions";
import { useState } from "react";
import { Icon } from "@iconify/react";
import MediaList from "./components/MediaList";

interface Props {}

const HomePage: NextPage<Props> = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col p-8 gap-4">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-zinc-100">
            Ani<span className="text-purple-800 font-black">Watch</span>
          </h1>
          <button className="p-4 -mr-4" onClick={() => signout()}>
            <Icon
              icon="tabler:logout"
              fontSize={24}
              className="text-zinc-300"
            />
          </button>
        </div>
        <div className="flex flex-1 items-center px-4 md:max-w-[512px] rounded bg-zinc-800">
          <Icon icon="tabler:search" fontSize={18} className="text-zinc-500" />
          <input
            type="search"
            name="anime-search"
            className="px-4 py-3 placeholder:italic placeholder:text-zinc-500 flex-1 bg-transparent outline-none"
            placeholder="Attack on Titan Season 2"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </header>
      <MediaList />
    </div>
  );
};

export default HomePage;
