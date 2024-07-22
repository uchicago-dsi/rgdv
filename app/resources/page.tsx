import SectionRenderer from "components/SectionRenderer"
import { getMdxContent } from "hooks/useMdxContent"

export const metadata = {
  title: "Resources :: Grocery Gap Atlas",
}

export default async function ResourcesPage() {
  const pageInfo = await getMdxContent("page", "resources.mdx")
  return <>{pageInfo && <SectionRenderer pageInfo={pageInfo} />}</>
}
