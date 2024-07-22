import { raceEthnicityColumns } from "../config"

export const cleanRaceData = (data: any) => {
  let raceData: Array<{ value: number; raceEthnicity: string }> = []

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

  return raceData
}
