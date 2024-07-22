"use server"
import { readMsgPackFile } from "./data/msgpack"
import { join } from "path"
export const getCentroid = async (id: string) => {
  const idType = {
    "5": "counties",
    "2": "states",
    "11": "tracts",
  }[id.length]
  if (!idType) throw new Error("Invalid ID")
  const dataPath = join(process.cwd(), "public", "data", "centroids", `${idType}_centroids.min.msgpack.gz`)
  const centroids = await readMsgPackFile<{ [key: string]: [number, number] }>(dataPath, true)
  if (!centroids[id]) throw new Error("Invalid ID")
  return centroids[id]
}
