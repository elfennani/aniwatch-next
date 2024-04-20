import React from "react";

const MediaListSkeleton = () => {
  return (
    <div className="flex gap-4 flex-col animate-pulse">
      <div className="h-8 max-w-full w-40 rounded bg-zinc-800" />
      <div className="flex border border-zinc-800 rounded-md">
        <div className="h-32 w-24 rounded bg-zinc-800" />
        <div className="flex flex-col justify-between flex-1 p-4">
          <div className=" h-6 w-52 max-w-full rounded bg-zinc-800" />
          <div className="flex justify-between">
            <div className=" h-4 w-12 rounded bg-zinc-800" />
            <div className=" h-4 w-24 rounded bg-zinc-800" />
          </div>
        </div>
      </div>
      <br />
      <div className="h-8 max-w-full w-40 rounded bg-zinc-800" />
      <div className="flex gap-4 border border-zinc-800 rounded-md">
        <div className="h-32 w-24 rounded bg-zinc-800" />
        <div className="flex flex-col justify-between flex-1 py-4">
          <div className=" h-6 w-52 max-w-full rounded bg-zinc-800" />
          <div className=" h-4 w-12 rounded bg-zinc-800" />
        </div>
      </div>
      <div className="flex gap-4 border border-zinc-800 rounded-md">
        <div className="h-32 w-24 rounded bg-zinc-800" />
        <div className="flex flex-col justify-between flex-1 py-4">
          <div className=" h-6 w-52 max-w-full rounded bg-zinc-800" />
          <div className=" h-4 w-12 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
};

export default MediaListSkeleton;
