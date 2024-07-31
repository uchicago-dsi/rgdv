import SectionRenderer from "components/SectionRenderer"
import { getMdxContent } from "hooks/useMdxContent"

export const metadata = {
  title: "Changelog :: Grocery Gap Atlas",
}

export default async function ChangelogPage() {
  const pageInfo = (await getMdxContent("page", "changelog.mdx")) as any
  return <>{pageInfo && <SectionRenderer pageInfo={pageInfo} />}</>
}
