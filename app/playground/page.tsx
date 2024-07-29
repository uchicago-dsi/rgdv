// "use client"
// import { useEffect, useState } from "react"
// import { MemoryMonitor } from "components/dev/MemoryMonitor"
// import { globals } from "utils/state/globals"

export const primaryColumns = [
  "gravity_2021_weighted",
  "gravity_2023_percentile",
  "gravity_2023_state_percentile",
  "hhi_2023_weighted",
  "hhi_2023_percentile",
  "hhi_2023_state_percentile",
  "segregation_ICE_Black_Alone_White_Alone_weighted",
  "segregation_2023_percentile",
  "segregation_2023_state_percentile",
  "GEOID",
  "NAME",
  "TOTAL_POPULATION",
  "NH_WHITE_ALONE",
  "NH_BLACK_ALONE",
  "NH_AMERICAN_INDIAN_ALONE",
  "NH_ASIAN_ALONE",
  "NH_PACIFIC_ISLANDER_ALONE",
  "NH_SOME_OTHER_RACE",
  "NH_TWO_OR_MORE",
  "NH_TWO_OR_MORE_INCLUDING_SOME_OTHER",
  "NH_TWO_OR_MORE_EXCLUDING_SOME_OTHER",
  "HISPANIC_OR_LATINO",
  "PCT NH WHITE",
  "PCT_NH_BLACK",
  "PCT_NH_AMERICAN_INDIAN",
  "PCT_NH_ASIAN",
  "PCT_NH_PACIFIC_ISLANDER",
  "PCT_NH_SOME_OTHER",
  "PCT_NH_TWO_OR_MORE",
  "PCT_NH_TWO_OR_MORE_INCLUDING_SOME_OTHER",
  "PCT_NH_TWO_OR_MORE_EXCLUDING_SOME_OTHER",
  "PCT_HISPANIC_OR_LATINO",
  "WITH_A_DISABILITY_TOTAL",
  "PCT_WITH_A_DISABILITY",
  "PCT_SNAP_ASSISTANCE",
  "MEDIAN_AGE",
  "POVERTY_RATE",
  "MEDIAN_HOUSEHOLD_INCOME",
  "NO_HEALTHCARE_TOTAL",
  "PCT_NO_HEALTHCARE",
  "ADI_NATRANK",
  "ADI_STATERNK",
  "UNIT",
  "UNIT_PLURAL",
] as const

// // const operators = ["=", "!=", ">", "<", ">=", "<=", "BETWEEN", "IN", "NOT IN", "LIKE", "NOT LIKE"]
// // const outputs = ["TABLE", "TIME_SERIES", "SCATTER", "HISTOGRAM"] as const
// // const reshapeResults = (
// //   results: Record<string, any>[],
// //   shape: (typeof outputs)[number],
// //   options: { timeseriesCol?: string; valueCol?: string }
// // ) => {
// //   switch (shape) {
// //     case "TABLE":
// //       return results
// //     case "TIME_SERIES":
// //       return results
// //     case "SCATTER":
// //       return results
// //     case "HISTOGRAM":
// //       return results
// //   }
// // }

// const TableOutput: React.FC<{ data: Array<Record<string, unknown>> }> = ({ data }) => {
//   if (!data.length) return null
//   const columns = Object.keys(data[0]!)
//   return (
//     <table className="max-h-full w-full table-auto">
//       <thead>
//         <tr className="max-w-[30%]">
//           {columns.map((col, i) => (
//             <th key={i}>{col}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((row, i) => (
//           <tr key={i}>
//             {columns.map((key, j: number) => (
//               // @ts-ignore
//               <td key={`${i}-${j}`}>{row[key]}</td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )
// }

// const outputMap = {
//   "TABLE": TableOutput,
// }

// const handleWriteQuery = ({
//   columns,
//   groupby,
//   limit,
//   filter,
// }: {
//   columns: string[],
//   groupby?: string,
//   limit?: number,
//   filter?: { column: string; operator: string; value: string | string[] | number }}
// ) => {
//   let query = `SELECT ${columns.join(", ")} FROM primary_data \n`
//   if (groupby) {
//     query += ` GROUP BY ${groupby} \n`
//   }
//   if (filter) {
//     query += ` WHERE ${filter.column} ${filter.operator} `
//     switch (filter.operator) {
//       case "IN":
//       case "NOT IN":
//         query += `(${filter.value})`
//         break
//       case "BETWEEN":
//         // @ts-ignore
//         query += `${filter.value[0]} AND ${filter.value[1]}`
//         break
//       default:
//         query += filter.value
//         break
//     }
//   }
//   if (limit) {
//     query += ` LIMIT ${limit}`
//   }
//   return query + ';'
// }

// export default function Playground() {
//   const [results, setResults] = useState<any[]>([])
//   const [currentfilter, setCurrentFilter] = useState<{
//     column: string
//     operator: string
//     value: string | string[] | number
//   }>({
//     column: "",
//     operator: "",
//     value: "",
//   })

//   const [currentColumns, setCurrentColumns] = useState<string[]>(primaryColumns as any)
//   const [includeFull, setIncludeFull] = useState<boolean>(false)
//   const [groupby, setGroupby] = useState<string | undefined>(undefined)
//   const [limit, setLimit] = useState<number>(100)

//   const handleQuery = async () => {
//     const query = handleWriteQuery({
//       columns: currentColumns,
//       groupby: groupby,
//       limit: limit,
//       filter: currentfilter,
//     })
//     await globals.ds.runQuery(query).then((res) => {
//       setResults((prev) => [...prev, res])
//     })
//   }

//   useEffect(() => {}, [])
//   return (
//     <div>
//       <MemoryMonitor />
//       <h1>Playground</h1>
//     </div>
//   )
// }

export default function Playground() {
  return null
}
