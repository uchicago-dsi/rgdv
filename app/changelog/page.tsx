import SectionRenderer from "components/SectionRenderer"
import { getMdxContent } from "hooks/useMdxContent"

export const metadata = {
  title: "Changelog :: Feeding Fairness",
}

export default async function ChangelogPage() {
  const pageInfo = await getMdxContent("page", "changelog.mdx")
  return <>{pageInfo && <SectionRenderer pageInfo={pageInfo} />}</>
}
