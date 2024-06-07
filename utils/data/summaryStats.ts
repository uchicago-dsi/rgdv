import { readMsgPackFile } from "./msgpack"
import { join } from "path"

export const getSummaryStats = async <T extends Record<string, unknown>>(level: 'tract'|'state'|'county'|'national', id: string) => {
  try {
    const filepath = join(process.cwd(), "public", "data", "summary", level, `${id.slice(0,2)}.min.msgpack.gz`) 
    const data = await readMsgPackFile<any>(filepath, true)
    const entry = data[id]
    const columns = data.columns
    if (!entry || !columns) {
      return {
        ok: false,
        error: `No data found for id "${id}"`,
      }
    }
    const result: Record<string, unknown> = {}
    for (const [i, col] of columns.entries()) {
      const value = entry[i]
      result[col] = value
    }
    return {
      ok: true,
      result: result as T
    }
  } catch (error) {
    console.log("Error getting messagepack data")
    console.log(error)
    return {
      ok: false,
      error: error,
    }
  }
}
