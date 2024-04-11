import { UnpackrStream } from "msgpackr"
import fs from "fs"

export const getSummaryStats = async <T extends any>(filepath: string, id: string) => {
  try {
    const stream = fs.createReadStream(filepath)
    const unpackr = new UnpackrStream()
    stream.pipe(unpackr)

    for await (const data of unpackr) {
      const d = data.get(id)
      if (d) {
        return d as T
      }
    }
    return new Map()
  } catch (error) {
    console.log("Error getting messagepack data")
    console.log(error)
    return new Map()
  }
}
