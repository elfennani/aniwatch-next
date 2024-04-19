import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const client_id = process.env.ANILIST_CLIENT_ID;
  const redirect_uri = process.env.ANILIST_REDIRECT;

  if (cookies().has("token")) {
    redirect("/app");
  }

  return (
    <main className="flex items-center justify-center min-h-svh">
      <a
        className="py-3 px-6 rounded-md bg-blue-500 text-white"
        href={`https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`}
      >
        Sign in with AniList
      </a>
    </main>
  );
}
