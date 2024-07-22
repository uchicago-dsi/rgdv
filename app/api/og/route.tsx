import { ImageResponse } from "next/og"
// App router includes @vercel/og.
// No need to install it.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locationName = searchParams.get("name") || "World"
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {locationName}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
