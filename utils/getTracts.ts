"use server"
import { readMsgPackFile } from "./data/msgpack"
import { join } from "path"

export const getTracts = async (id: string) => {
  const dataPath = join(process.cwd(), "public", "data", "centroids", `tracts_centroids.min.msgpack.gz`)
  const centroids = await readMsgPackFile<{ [key: string]: [number, number] }>(dataPath, true)
  const keys = Object.keys(centroids)
  return keys.filter((key) => key.startsWith(id))
}
