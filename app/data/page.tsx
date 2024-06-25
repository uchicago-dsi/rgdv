import SectionRenderer from "components/SectionRenderer";
import { getMdxContent } from "hooks/useMdxContent";

export const metadata = {
  title: "Data :: Feeding Fairness"
}

export default async function AboutPage() {
  const pageInfo = await getMdxContent("page", "data.mdx")
  return (
    <>
      {pageInfo && <SectionRenderer pageInfo={pageInfo} />}
    </>
  )
}
