import { UnpackrStream } from "msgpackr"
import fs from "fs"

export const getSummaryStats = async <T extends Record<string, unknown>>(filepath: string, id: string) => {
  try {
    const stream = fs.createReadStream(filepath)
    const unpackr = new UnpackrStream()
    stream.pipe(unpackr)

    for await (const data of unpackr) {
      const d = data.get(id)
      if (d) {
        return {
          ok: true,
          result: Object.fromEntries(d) as T
        }
      }
    }
    return {
      ok: false,
      error: `No data found for id "${id}"`
    }
  } catch (error) {
    console.log("Error getting messagepack data")
    console.log(error)
    return {
      ok: false,
      error: error
    }
  }
}
