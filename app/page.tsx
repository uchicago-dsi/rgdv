import Home from "components/Pages/Home";
import { getMdxContent } from "hooks/useMdxContent";

export const metadata = {
  title: "Grocery Gap Atlas"
}

export default async function HomePage() {
  const pageInfo = await getMdxContent("page", "home.mdx")
  return (
    <>
      {pageInfo && <Home pageInfo={pageInfo} />}
    </>
  )
}
