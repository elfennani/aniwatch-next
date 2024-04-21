import { Suspense } from "react";
import ShowEpisodes from "../components/ShowEpisodes";

export default function Layout({
  children,
  params: { id, ep },
}: {
  children: React.ReactNode;
  params: { id: string; ep: string };
}) {
  // const heads = useParams

  return (
    <section className="h-dvh flex flex-col">
      <div>{children}</div>
      <div className="p-8 overflow-y-scroll h-full">
        <ShowEpisodes id={Number(id)} />
      </div>
    </section>
  );
}
