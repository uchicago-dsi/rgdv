"use server"
import { StoreEntry } from "./types"
import { readRemoteMsgPackFile } from "utils/data/msgpack"
import { mapArrayToRecords } from "utils/data/mapArrayToRecords"

export type ReqParams = {
  params: {
    geoid: string
  }
}

const cache: any = {}
let columns: string[] = []

const getStores = async (geoid: string) => {
  const county = geoid.slice(0, 5) as keyof typeof cache
  if (cache[county] === undefined) {
    const data = await readRemoteMsgPackFile<Record<string, Record<string, StoreEntry>>>(`${process.env.DATA_ENDPOINT}stores/${String(county)}.msgpack.gz`, true)
    cache[county] = data
    if (!columns.length && data.columns) {
      // @ts-ignore
      columns = data.columns
    }
  }
  const id = geoid as keyof typeof cache[typeof county]
  if (!cache[county]?.[id]) {
    return []
  }
  const entry = cache[county]![id] as unknown as any[][]
  // @ts-ignore
  return mapArrayToRecords(entry, columns).sort((a, b) => b['PCT OF TRACT SALES'] - a['PCT OF TRACT SALES'])
}

export async function GET(_req: Request, reqParams: ReqParams) {
  const geoid = reqParams.params.geoid
  if (!geoid || geoid === "null") {
    return new Response("Not found", { status: 404 })
  }
  const data = await getStores(geoid)
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  })
}
