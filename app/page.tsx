import { client } from 'tina/__generated__/client'
import Home from "components/Pages/Home";

export const metadata = {
  title: "Feeding Fairness",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://rgdv.vercel.app",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/.github/assets/project-logo.png",
      },
    ],
  },
}
type HomePageContent = {
  sections: Array<{
    title: string,
    body: string
  }>
}

export default async function HomePage() {
  const pageInfo = await client.queries.page({ relativePath: 'home.mdx' })
  return (
    <>
      <Home pageInfo={pageInfo} />
    </>
  )
}
