export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="w-full bg-zinc-800 aspect-video"></div>
      <div className="p-8 flex flex-col gap-4">
        <div className="w-full h-[69.75px] bg-zinc-800 rounded-md"></div>
        <div className="w-full h-[69.75px] bg-zinc-800 rounded-md"></div>
        <div className="w-full h-[69.75px] bg-zinc-800 rounded-md"></div>
      </div>
    </div>
  );
}
