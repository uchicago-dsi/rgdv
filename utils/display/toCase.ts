export const toCase = (
  text: string,
  caseType: "camel" | "pascal" | "kebab" | "snake" | "dot" | "title" | "sentence" | "header" | "constant"
) => {
  let result = `${text}`.toLocaleLowerCase()
  switch (caseType) {
    case "camel":
      result = result.replace(/[-_./\s](.)/g, (_, c) => c.toUpperCase())
      break
    case "pascal":
      result = result.replace(/[-_./\s](.)/g, (_, c) => c.toUpperCase())
      result = result.charAt(0).toUpperCase() + result.slice(1)
      break
    case "kebab":
      result = result.replace(/[-_./\s](.)/g, (_, c) => `-${c}`)
      break
    case "snake":
      result = result.replace(/[-_./\s](.)/g, (_, c) => `_${c}`)
      break
    case "dot":
      result = result.replace(/[-_./\s](.)/g, (_, c) => `.${c}`)
      break
    case "title":
      result = result.charAt(0).toUpperCase() + result.slice(1)
      result = result.replace(/[-_./\s](.)/g, (_, c) => ` ${c.toUpperCase()}`)
      break
    case "sentence":
      result = result.charAt(0).toUpperCase() + result.slice(1)
      break
    case "header":
      result = result.replace(/[-_./\s](.)/g, (_, c) => `-${c.toUpperCase()}`)
      break
    case "constant":
      result = result.replace(/[-_./\s](.)/g, (_, c) => `_${c.toUpperCase()}`)
      break
  }
  return result
}
