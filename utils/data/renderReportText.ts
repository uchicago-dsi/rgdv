import { TinaMarkdownContent } from "tinacms/dist/rich-text"
import { formatMarkdownTemplate, getThresholdValue } from "./formatDataTemplate"

const UNIT_INFO = {
  2: {
    UNIT: 'state',
    UNIT_PLURAL: 'states',
  },
  5: {
    UNIT: 'county',
    UNIT_PLURAL: 'counties',
  },
  11: {
    UNIT: 'tract',
    UNIT_PLURAL: 'tracts',
  }
}
const nullResultText = {
  type: 'root',
  children: [{ type: 'text', text: 'No Data' }],
} as any as TinaMarkdownContent

const NULL_RESULTS: Record<string, any> = {
  value: 'Value not found',
  text: nullResultText,
  tooltip: nullResultText,
  title: 'Title Not Found',
}

const getStatResult = (
  generalStatText: any,
  measure: string,
  data: any
) => {
  const template = generalStatText?.data?.statistics?.overview?.find((f: any) => f.measure === measure)
  if (!template) return NULL_RESULTS
  const value = Number(data[template.column as keyof typeof data])
  if (isNaN(value)) return NULL_RESULTS
  const text = getThresholdValue(value, data, template) || NULL_RESULTS.text
  const tooltip = formatMarkdownTemplate(template.tooltip, data) || NULL_RESULTS.tooltip
  const title = formatMarkdownTemplate(template.title, data) || NULL_RESULTS.title

  return {
    value,
    text,
    tooltip,
    title,
  }
}
// NH WHITE ALONE: Population count of Non-Hispanic White Alone individuals.NH BLACK ALONE: Population count of Non-Hispanic Black Alone individuals.NH AMERICAN INDIAN ALONE: Population count of Non-Hispanic American Indian Alone individuals.NH ASIAN ALONE: Population count of Non-Hispanic Asian Alone individuals.NH PACIFIC ISLANDER ALONE: Population count of Non-Hispanic Pacific Islander Alone individuals.NH SOME OTHER RACE: Population count of Non-Hispanic individuals of some other race.NH TWO OR MORE: Population count of Non-Hispanic individuals of two or more races.NH TWO OR MORE INCLUDING SOME OTHER: Population count of Non-Hispanic individuals of two or more races, including some other race.NH TWO OR MORE EXCLUDING SOME OTHER: Population count of Non-Hispanic individuals of two or more races, excluding some other race.HISPANIC OR LATINO: Population count of Hispanic or Latino individuals.
const raceEthnicityColumns = [
  "NH WHITE ALONE",
  "NH BLACK ALONE",
  "HISPANIC OR LATINO",
  "NH AMERICAN INDIAN ALONE",
  "NH ASIAN ALONE",
  "NH PACIFIC ISLANDER ALONE",
  "NH SOME OTHER RACE",
  "NH TWO OR MORE",
  "NH TWO OR MORE INCLUDING SOME OTHER",
  "NH TWO OR MORE EXCLUDING SOME OTHER",
]

export const renderReportText = (_data: Record<string, any>, generalStatText: any, id: string) => {
  // @ts-ignore
  const unitInfo = UNIT_INFO[id.length]
  const data = {
    ..._data,
    ...unitInfo
  }
  const stats = generalStatText?.data?.statistics?.stat
  const name = data.NAME.toLowerCase().includes("tract") ? data.NAME : `${data.NAME}`

  const foodAccess = getStatResult(generalStatText, "gravity", data)
  const marketPower = getStatResult(generalStatText, "hhi", data)
  const segregation = getStatResult(generalStatText, "segregation", data)
  const economicAdvantage = getStatResult(generalStatText, "adi", data)
  const descriptionText = formatMarkdownTemplate(generalStatText.data.statistics.body, data)
  
  let raceData: Array<{value: number, raceEthnicity: string}> = []

  raceEthnicityColumns.forEach((column) => {
    const value = data[column]
    if (value) {
      raceData.push({
        raceEthnicity: column,
        value: +value,
      })
    }
  })

  raceData = raceData.sort((a, b) => b.value - a.value)

  return {
    name,
    stats,
    data,
    foodAccess,
    marketPower,
    segregation,
    economicAdvantage,
    descriptionText,
    raceData
  }
}
