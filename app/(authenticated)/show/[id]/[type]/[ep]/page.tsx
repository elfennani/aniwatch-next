/* eslint-disable @next/next/no-img-element */
import { graphql } from "gql.tada";
import { NextPage } from "next";
import PlayerLoader from "./PlayerLoader";
import { redirect } from "next/navigation";
import Link from "next/link";
import useAllAnimeClient from "@/app/(authenticated)/lib/hooks/useAllAnimeClient";
import useAniListClient from "@/app/(authenticated)/lib/hooks/useAniListClient.server";

interface Props {
  params: {
    id: string;
    ep: string;
  };
}

interface ShowQuery {
  shows: {
    edges: [
      {
        _id: string;
        aniListId: number;
        availableEpisodesDetail: {
          sub: number[];
          dub: number[];
          raw: number[];
        };
      }
    ];
  };
}

const show_query = `
  query($search: String) {
    shows(
        search: {
          query: $search
        }
        page: 1
      ) {
        edges {
          _id
          aniListId
          availableEpisodesDetail
        }
      }
  }
`;

const media_query = graphql(`
  query GetMedia($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        userPreferred
      }
    }
  }
`);

const WatchByIdPage: NextPage<Props> = async ({ params: { id, ep } }) => {
  const allanime = useAllAnimeClient();
  const anilist = useAniListClient();

  const media = await anilist.request(media_query, { id: Number(id) });
  let showSearch: ShowQuery;
  let retries = 0;

  while (retries < 3) {
    try {
      showSearch = await allanime.request(show_query, {
        search: media.Media?.title?.userPreferred,
      });
      break;
    } catch (error) {
      retries++;
      await new Promise((res) => setTimeout(res, 100));
    }
  }
  const show = showSearch!!.shows.edges?.find(
    (show) => show.aniListId == Number(id)
  );

  if (!show) redirect("/");

  return (
    <div className="h-dvh flex flex-col">
      <PlayerLoader showId={show?._id} episode={Number(ep)} />
      <ul className="overflow-y-scroll h-full">
        {show.availableEpisodesDetail.sub.map((epNum) => (
          <li key={epNum}>
            <Link
              className={`w-full p-4 flex items-center gap-4 ${
                epNum.toString() == ep && "bg-purple-900"
              }`}
              href={`/show/${id}/watch/${epNum}`}
            >
              <img
                src={`https://wp.youtube-anime.com/aln.youtube-anime.com/data2/ep_tbs/${show._id}/${epNum}_sub.jpg?w=380`}
                alt={epNum.toString()}
                width={124}
                className="rounded"
              />
              <div>
                <p>Episode {epNum}</p>
                {epNum.toString() == ep && (
                  <p className="font-medium text-sm">Currently Watching</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WatchByIdPage;
