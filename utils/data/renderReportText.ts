import { getThresholdValue } from "./formatDataTemplate"

export const renderReportText = (data: Record<string, any>, generalStatText: any) => {
  // @ts-ignore
  const stats = generalStatText?.data?.statistics?.stat
  // @ts-ignore
  const foodAccesstemplate = generalStatText?.data?.statistics?.overview?.find((f) => f.measure === "gravity")
  // @ts-ignore
  const marketPowerTemplate = generalStatText?.data?.statistics?.overview?.find((f) => f.measure === "hhi")
  // @ts-ignore
  const segregationTemplate = generalStatText?.data?.statistics?.overview?.find((f) => f.measure === "segregation")
  // @ts-ignore
  const economicAdvantageTemplate = generalStatText?.data?.statistics?.overview?.find((f) => f.measure === "adi")

  // @ts-ignore
  const name = data.NAME.toLowerCase().includes("tract") ? data.NAME : `${data.NAME} tract`

  // @ts-ignore
  const [foodAccess, marketPower, segregation, economicAdvantage] = [
    +data[foodAccesstemplate.column as keyof typeof data],
    100 - +data[marketPowerTemplate.column as keyof typeof data],
    100 - +data[segregationTemplate.column as keyof typeof data],
    100 - +data[economicAdvantageTemplate.column as keyof typeof data],
  ]

  const foodAccessText = getThresholdValue(foodAccess, data, foodAccesstemplate)
  const marketPowerText = getThresholdValue(marketPower, data, marketPowerTemplate)
  const segregationText = getThresholdValue(segregation, data, segregationTemplate)
  const economicAdvantageText = getThresholdValue(economicAdvantage, data, economicAdvantageTemplate)

  return {
    name,
    stats,
    data,
    foodAccess: {
      value: foodAccess,
      text: foodAccessText,
      title: foodAccesstemplate.title,
      tooltip: foodAccesstemplate.tooltip,
    },
    marketPower: {
      value: marketPower,
      text: marketPowerText,
      title: marketPowerTemplate.title,
      tooltip: marketPowerTemplate.tooltip,
    },
    segregation: {
      value: segregation,
      text: segregationText,
      title: segregationTemplate.title,
      tooltip: segregationTemplate.tooltip,
    },
    economicAdvantage: {
      value: economicAdvantage,
      text: economicAdvantageText,
      title: economicAdvantageTemplate.title,
      tooltip: economicAdvantageTemplate.tooltip,
    },
  }
}
