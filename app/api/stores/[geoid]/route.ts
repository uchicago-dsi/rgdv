"use server"
import { unpack } from 'msgpackr';
import nodeFetch from "node-fetch";

export type ReqParams = {
  params: {
    geoid: string
  }
}

const isochorones: Record<string, Record<string, {geometry:any}>> = {}

const getIsochrone = async (geoid: string) => {
  const state =  geoid.slice(0, 2)
  if (isochorones[state] === undefined) {
    const r = await nodeFetch(`${process.env.DATA_ENDPOINT}isochrones/isochrones${state}.msgpack`)
    const buffer = await r.arrayBuffer()
    const dataBuffer = Buffer.from(buffer)
    let data = unpack(dataBuffer);
    isochorones[state] = data
  }
  return isochorones[state]![geoid]
}

export async function GET(_req: Request, reqParams: ReqParams) {
  const geoid = reqParams.params.geoid
  if (!geoid || geoid == 'null') {
    return new Response("Not found", { status: 404 });
  }
  const data = await getIsochrone(geoid);
  // console.log(data)
  // @ts-ignore
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
    },
  })
}