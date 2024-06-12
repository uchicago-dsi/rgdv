import { getMdxContent } from "hooks/useMdxContent"
import { getSummaryStats } from "utils/data/summaryStats"

const units = {
  1: "national",
  2: "state",
  5: "county",
  11: "tract",
} as const

type SummaryReq = {
  params: {
    id: string
  }

}
export const GET = async (req: SummaryReq ) => {
  const { id } = req.params
  const unit = units[id.length as keyof typeof units]

  const [data, statText] = await Promise.all([
    getSummaryStats<any>(unit, id),
    getMdxContent("statistics", "primary.mdx"),
  ])
  return new Response(JSON.stringify({ data, statText }), {
    headers: {
      "content-type": "application/json",
    },
  })
}