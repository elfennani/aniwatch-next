"use client";
import Tag from "@/interfaces/Tag";
import React, { useState } from "react";
import { twJoin } from "tailwind-merge";

type Props = {
  tags: Tag[];
};

const TagsGrid = (props: Props) => {
  const [shown, setShown] = useState(false);

  return (
    <section className="px-8 py-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold mb-4">Tags</h2>
        <button
          className="text-xs p-2 -mr-2 relative text-purple-500"
          onClick={() => setShown(!shown)}
        >
          {shown ? "Hide" : "Show"} Spoilers
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
        {props.tags
          .filter((tag) => shown || !tag.spoiler)
          .map((tag) => (
            <li
              key={tag.id}
              className={twJoin(
                "flex items-baseline text-sm",
                tag.spoiler && "text-purple-500 font-bold"
              )}
            >
              <span className="flex-1 line-clamp-1 text-ellipsis">
                {tag.name}
              </span>
              {!!tag.rank && (
                <span className="text-zinc-400 text-xs">{tag.rank}%</span>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
};

export default TagsGrid;
