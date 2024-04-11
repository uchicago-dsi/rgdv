"use server"
import { UnpackrStream } from "msgpackr"
import fs from "fs"

export const getSummaryStats = async <T extends any>(filepath: string, id: string) => {
  const stream = fs.createReadStream(filepath)
  const unpackr = new UnpackrStream()
  stream.pipe(unpackr)

  for await (const data of unpackr) {
    const d = data.get(id)
    if (d) {
      return d as T
    }
  }
  return {}
}