// import { ImageResponse } from "next/og"
import { findNames } from "utils/getFilteredNames"
// App router includes @vercel/og.
// No need to install it.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const searchTerm = searchParams.get("search")
  const limit = typeof searchParams.get("limit") === 'string' ? +(searchParams.get("limit") as string) : 5
  if (!searchTerm) return new Response("Missing search term", { status: 400 })
  const names = await findNames(searchTerm, limit)
  return new Response(JSON.stringify(names.slice(0, 5)), {
    headers: {
      "content-type": "application/json",
    },
  })
}
