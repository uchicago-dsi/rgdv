import SectionRenderer from "components/SectionRenderer"
import { getMdxContent } from "hooks/useMdxContent"

export const metadata = {
  title: "Contact :: Grocery Gap Atlas",
}

export default async function ContactPage() {
  const pageInfo = await getMdxContent("page", "contact.mdx")
  return <>{pageInfo && <SectionRenderer pageInfo={pageInfo} />}</>
}
