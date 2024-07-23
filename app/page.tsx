import Home from "components/Pages/Home"
import { getMdxContent } from "hooks/useMdxContent"

export const metadata = {
  title: "Grocery Gap Atlas",
}

export default async function HomePage() {
  const pageInfo = await getMdxContent("page", "home.mdx")
  if (pageInfo instanceof Error) {
    return (
      <div className="prose m-auto my-12">
        <h1>Unable to find page</h1>
        <a href="/">Home</a>
      </div>
    )
  }

  return <>{pageInfo && <Home pageInfo={pageInfo} />}</>
}
