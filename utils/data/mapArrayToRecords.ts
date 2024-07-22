export const mapArrayToRecords = (data: any[][], columns: string[]) => {
  if (!data || !columns) return []
  if (!data.length || !columns.length) return []
  if (data[0]!.length !== columns.length) return []
  let cleanData = []
  for (let i = 0; i < data.length; i++) {
    let row = data[i]!
    let obj = {}
    for (let j = 0; j < columns.length; j++) {
      // @ts-ignore
      obj[columns[j]] = row[j]
    }
    cleanData.push(obj)
  }
  return cleanData
}
