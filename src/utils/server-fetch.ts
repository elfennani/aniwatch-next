import { cookies } from "next/headers"

const server_fetch = (input: string) =>
  fetch(`${process.env.URL}${input}`, {
    headers: {
      "Cookie": cookies().toString()
    }
  })


export default server_fetch