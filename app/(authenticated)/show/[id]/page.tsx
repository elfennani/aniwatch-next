import { graphql } from "gql.tada";
import { GraphQLClient } from "graphql-request";
import { NextPage } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

const show_query = graphql(`
  query ShowById($id: Int) {
    Media(id: $id) {
      id
      coverImage {
        extraLarge
      }
      title {
        userPreferred
      }
      description
    }
  }
`);

const ShowById: NextPage<Props> = async ({ params: { id } }) => {
  const tokenCookie = cookies().get("token");
  if (!tokenCookie) return redirect("/");
  const { value: token } = tokenCookie;

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  const client = new GraphQLClient("https://graphql.anilist.co", { headers });
  const res = await client.request(show_query, { id: Number(id) });

  return (
    <div className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl">{res.Media?.title?.userPreferred}</h1>
      <p>{res.Media?.description}</p>
      <img
        className="w-64 rounded-xl"
        src={res.Media?.coverImage?.extraLarge!!}
        alt={res.Media?.title?.userPreferred!!}
      />
    </div>
  );
};

export default ShowById;
