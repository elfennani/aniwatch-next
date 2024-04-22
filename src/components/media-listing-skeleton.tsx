import React from "react";

type Props = {
  length?: number;
};

const MediaListingSkeleton = ({ length = 1 }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-8 max-w-full w-40 rounded bg-zinc-800" />
      {Array.from({ length }, (_, index) => (
        <div key={index} className="flex border border-zinc-800 rounded-md">
          <div className="h-32 w-24 rounded bg-zinc-800" />
          <div className="flex flex-col justify-between flex-1 p-4">
            <div className=" h-6 w-52 max-w-full rounded bg-zinc-800" />
            <div className="flex justify-between">
              <div className=" h-4 w-12 rounded bg-zinc-800" />
              <div className=" h-4 w-24 rounded bg-zinc-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaListingSkeleton;
