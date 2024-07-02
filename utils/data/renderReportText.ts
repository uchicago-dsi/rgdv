import { TinaMarkdownContent } from "tinacms/dist/rich-text"
import { formatMarkdownTemplate, getThresholdValue } from "./formatDataTemplate"
import { cleanRaceData } from "./cleaning/cleanRaceData"

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
  value: '--',
  text: nullResultText,
  tooltip: nullResultText,
  title: 'Title Not Found',
}

const getNullResults = (overrides: object) => ({
  ...NULL_RESULTS,
  ...overrides,
})

const getStatResult = (
  generalStatText: any,
  measure: string,
  data: any,
  comparability: string = "national"
) => {
  const template = generalStatText?.data?.statistics?.overview?.find((f: any) => f.measure === measure)
  if (!template) return NULL_RESULTS
  const _templateColumn = template[`column_${comparability}` as keyof typeof template]
  const templateColumn = _templateColumn || template?.[Object.keys(template).find((key) => key.startsWith("column_"))!]
  if (!templateColumn) return getNullResults({ title: template.title })
  const value = Number(data[templateColumn])
  if (isNaN(value)) return getNullResults({ title: template.title })
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

export const renderReportText = (
  _data: Record<string, any>, 
  generalStatText: any, 
  id: string,
  comparability: string = "national"
) => {
  // @ts-ignore
  const unitInfo = UNIT_INFO[id.length]
  const data = {
    ..._data,
    ...unitInfo
  }
  const stats = generalStatText?.data?.statistics?.stat
  const name = data.NAME.toLowerCase().includes("tract") ? data.NAME : `${data.NAME}`

  const foodAccess = getStatResult(generalStatText, "gravity", data, comparability)
  const marketPower = getStatResult(generalStatText, "hhi", data, comparability)
  const segregation = getStatResult(generalStatText, "segregation", data, comparability)
  const economicAdvantage = getStatResult(generalStatText, "adi", data, comparability)
  const descriptionText = formatMarkdownTemplate(generalStatText.data.statistics.body, data)
  const raceData = cleanRaceData(data)

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
