import parseRich from "./parseRich"

const parseRichRecursive = (data: any, schema: any) => {
  const keys = Object.keys(data)
  keys.forEach((key) => {
    const keySchema = schema.fields.find((f: any) => f.name === key)
    if (!keySchema) return
    if (keySchema.type === "rich-text") {
      data[key] = parseRich(data[key])
    } else if (keySchema.list && keySchema.type === "object") {
      data[key].forEach((d: any) => parseRichRecursive(d, keySchema))
    } else if (keySchema.type === "object") {
      parseRichRecursive(data[key], keySchema)
    }
  })
  return data
}

export default parseRichRecursive
