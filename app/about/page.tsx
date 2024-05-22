import SectionRenderer from "components/SectionRenderer";
import { getMdxContent } from "hooks/useMdxContent";

export const metadata = {
  title: "About :: Feeding Fairness"
}

export default async function AboutPage() {
  const pageInfo = await getMdxContent("page", "about.mdx")
  return (
    <>
      {pageInfo && <SectionRenderer pageInfo={pageInfo} />}
    </>
  )
}
