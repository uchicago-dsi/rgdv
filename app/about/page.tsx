import About from "components/Pages/About";
import { getMdxContent } from "hooks/useMdxContent";

export const metadata = {
  title: "About :: Feeding Fairness"
}

export default async function AboutPage() {
  const pageInfo = await getMdxContent("page", "about.mdx")
  return (
    <>
      {pageInfo && <About pageInfo={pageInfo} />}
    </>
  )
}
