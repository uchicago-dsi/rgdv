import { join } from "path"
import { readMsgPackFile } from "./data/msgpack"

class NameFinder {
  namesData: Array<{
    NAME: string
    GEOID: string
    UNIT: string
  }> = []
  namesFilePath = join(process.cwd(), "public", "data", "names.min.msgpack.gz")
  constructor(namesFilePath?: string) {
    namesFilePath && (this.namesFilePath = namesFilePath)
  }
  async init() {
    if (this.namesData.length) return
    this.namesData = await readMsgPackFile(this.namesFilePath, true)
  }
  async getFilteredNames(_search: string, limit?: number) {
    await this.init()
    const search = _search?.toLowerCase()
    let iters = 0
    const f = (s: { NAME: string; GEOID: string }) => {
      if (!s.NAME || !s.GEOID) return false
      return s.NAME.toLowerCase().includes(search) || s.GEOID.includes(search)
    }

    const namesOut = []

    for (let i = 0; i < this.namesData.length; i++) {
      if (f(this.namesData[i] as any)) {
        namesOut.push(this.namesData[i])
        iters++
        if (limit && iters >= limit) break
      }
    }

    return this.namesData.filter(f)
  }
}

const nameFinder = new NameFinder()

export const findNames = async (search: string, limit?: number) => {
  return nameFinder.getFilteredNames(search, limit)
}
