"use server"
import path from "path";
import fs from "fs";
import { unpack } from 'msgpackr';

export type ReqParams = {
  params: {
    geoid: string
  }
}

const isochorones: Record<string, Record<string, {geometry:any}>> = {}

const getIsochrone = async (geoid: string) => {
  const state =  geoid.slice(0, 2)
  if (isochorones[state] === undefined) {
    const isochroneFile = path.join(process.cwd(), "public", "data", "isochrones", `isochrones${state}.msgpack`)
    const buffer = fs.readFileSync(isochroneFile)
    let data = unpack(buffer);
    isochorones[state] = data
  }
  return isochorones[state]![geoid]
}

export async function GET(request: Request, reqParams: ReqParams) {
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