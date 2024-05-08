"use server"
import { unpack } from "msgpackr"
import { StoreData } from "./types"
import nodeFetch from "node-fetch"

export type ReqParams = {
  params: {
    geoid: string
  }
}

const cache: Record<string, StoreData> = {}

const getStores = async (geoid: string) => {
  const county = geoid.slice(0, 5)
  if (cache[county] === undefined) {
    const r = await nodeFetch(`${process.env.DATA_ENDPOINT}stores${county}.msgpack`)
    const buffer = await r.arrayBuffer()
    const dataBuffer = Buffer.from(buffer)
    let data = unpack(dataBuffer)
    cache[county] = data as StoreData
  }
  return cache[county]?.filter((store) => store.GEOID === geoid) || []
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
