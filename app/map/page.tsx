import MapPageInner from "components/Pages/Map"
import { getMdxContent } from "hooks/useMdxContent"

export const metadata = {
  title: "Map :: Grocery Gap Atlas",
}

export default async function MapPage() {
  const pageInfo = await getMdxContent("page", "map.mdx")
  return (
    <>
      {/* @ts-ignore */}
      <MapPageInner pageInfo={pageInfo} />
    </>
  )
}
