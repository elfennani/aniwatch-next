export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="p-8 border-b border-zinc-800">
        <div className="flex">
          <div className="h-44 w-32 bg-zinc-800 rounded"></div>
          <div className="flex flex-col justify-end p-4 gap-2">
            <div className="h-8 w-52 max-w-full rounded bg-zinc-800"></div>
            <div className="h-4 w-10 rounded bg-zinc-800"></div>
            <div className="h-4 w-16 rounded bg-zinc-800"></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="h-6 w-12 bg-zinc-800 rounded"></div>
          <div className="h-6 w-16 bg-zinc-800 rounded"></div>
          <div className="h-6 w-12 bg-zinc-800 rounded"></div>
          <div className="h-6 w-20 bg-zinc-800 rounded"></div>
        </div>
      </div>
      <div className="p-8 flex flex-col gap-4">
        <div className="h-6 w-24 rounded bg-zinc-800"></div>
        <div className="flex flex-col gap-2">
          <div className="h-6 max-w-full rounded bg-zinc-800"></div>
          <div className="h-6 max-w-full rounded bg-zinc-800"></div>
          <div className="h-6 w-52 rounded max-w-[75%] bg-zinc-800"></div>
        </div>
      </div>
    </div>
  );
}
