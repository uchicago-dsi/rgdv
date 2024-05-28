"use server"
import { mapArrayToRecords } from "utils/data/mapArrayToRecords"
import { readRemoteMsgPackFile } from "utils/data/msgpack"
import { StoreEntry } from "./types"

export type ReqParams = {
  params: {
    geoid: string
  }
}

const cache: Record<'county'|'state'|'tract', any> = {
  county: {},
  state: {},
  tract: {},
}

let columns: Record<'county'|'state'|'tract', any>  = {
  county: [],
  state: [],
  tract: [],
}

const getStores = async (geoid: string) => {
  const queryType = geoid.length === 2 ? 'state' : geoid.length === 5 ? 'county' : 'tract'
  const county = geoid.slice(0, 5) as keyof typeof cache
  const state = geoid.slice(0, 2) as keyof typeof cache
  const filename = queryType === 'tract' ? county : state
  if (cache[queryType][filename] === undefined) {
    const data = await readRemoteMsgPackFile<Record<string, Record<string, StoreEntry>>>(`${process.env.DATA_ENDPOINT}stores/${queryType}/${filename}.msgpack.gz`, true)
    if (Array.isArray(data)) {
      if (cache[queryType][filename] === undefined) {
        cache[queryType][filename] = {}
      }
      cache[queryType][filename][geoid] = data
    } else {
      cache[queryType][filename] = data
    }

    if (!columns[queryType].length && data.columns) {
      // @ts-ignore
      columns[queryType] = data.columns
    }
  }
  if (!cache[queryType][filename]?.[geoid]) {
    return []
  }
  const entry = cache[queryType][filename][geoid] as unknown as any[][]
  const salesColumn = columns[queryType].find((col: any) => col.toLowerCase().includes("sales")) 
  const recordsData = Array.isArray(entry[0]) ? mapArrayToRecords(entry, columns[queryType]) : entry
  // @ts-ignore
  return recordsData.sort((a, b) => b[salesColumn] - a[salesColumn])
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
