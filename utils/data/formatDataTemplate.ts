import { TinaMarkdownContent } from "tinacms/dist/rich-text"

const operators = ["-", "+", "*", "/"] as const

const formatter = new Intl.NumberFormat('en-US', { 
  maximumSignificantDigits: 3, 
  notation: 'compact' 
})

const handleOperator = (operator: (typeof operators)[number], value: number, value2: number) => {
  switch (operator) {
    case "-":
      return value - value2
    case "+":
      return value + value2
    case "*":
      return value * value2
    case "/":
      return value / value2
  }
}

export const formatDataTemplate = <T extends Record<string, any>>(_template: string, data: T) => {
  let template = `${_template}`
  // find all %%string%%
  const matches = template.match(/%%(.*?)%%/g)
  if (matches) {
    matches.forEach((match) => {
      const key = match.replace(/%/g, "")
      if (key.includes("|")) {
        const parts = key.split("|").map((_part: string) => {
          if (!isNaN(+_part)) {
            return +_part
          }
          const part = _part.trim() as string
          if (operators.includes(part)) {
            return part
          }
          const value = data[part] as any
          return value || null
        })
        const [value1, operator, value2] = parts
        if (!value1 || !value2 || !operator) return
        const result = formatter.format(handleOperator(operator, value1, value2))
        template = template.replace(match, `${result}`)
      } else {
        const value = isNaN(data[key]) ? data[key] as any : formatter.format(data[key] as any)
        value && (template = template.replace(match, `${value}`))
      }
    })
  }
  return template
}

export const formatMarkdownTemplate = <T extends Record<string, any>>(body: object, data: T) => {
  const template = JSON.stringify(body)
  const formatted = formatDataTemplate(template, data)
  return JSON.parse(formatted) as TinaMarkdownContent[]
}

export const getThresholdValue = (value: number | string, data: any, stat: any) => {
  let content = null
  if (value === undefined) return null
  const templates = stat.templates
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i]
    if (!template.threshold || value >= template.threshold) {
      content = formatMarkdownTemplate(template.body, data)
      break
    }
  }
  return content
}