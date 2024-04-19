import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { code } = await request.json()
  const cookieStore = cookies()
  console.log("token", cookieStore.getAll())

  const {
    ANILIST_CLIENT_ID: client_id,
    ANILIST_SECRET: client_secret,
    ANILIST_REDIRECT: redirect_uri,
  } = process.env;

  const url = "https://anilist.co/api/v2/oauth/token";
  const body = {
    grant_type: "authorization_code",
    client_id,
    client_secret,
    redirect_uri,
    code,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log("route-status:", res.status)
    if (res.status != 200)
      return Response.error()

    const json = await res.json();
    console.log("json", json)
    const response = cookieStore.set({
      name: "token",
      value: json.access_token,
    })
    console.log(response)

    return new Response(undefined, { status: 204, })
  } catch (error) {
    return Response.error()
  }

}

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")!!
  const cookieStore = cookies()

  const {
    ANILIST_CLIENT_ID: client_id,
    ANILIST_SECRET: client_secret,
    ANILIST_REDIRECT: redirect_uri,
  } = process.env;

  const url = "https://anilist.co/api/v2/oauth/token";
  const body = {
    grant_type: "authorization_code",
    client_id,
    client_secret,
    redirect_uri,
    code,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (res.status != 200)
      return Response.error()


    const json = await res.json();
    cookieStore.set({
      name: "token",
      value: json.access_token,
      expires: json.expires_in * 1000 + Date.now()
    })

  } catch (error) {
    return Response.error()
  }

  return NextResponse.redirect(process.env.URL!!)
}