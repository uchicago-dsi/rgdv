"use client"

import { useEffect, useState } from "react"
import { DataService } from "utils/data/service/service"
import { d3Bivariate } from "utils/data/service/types"
const _ds = new DataService()

const colorKeys = Object.keys(d3Bivariate)

export default function Playground() {
  const [ds, setDs] = useState<DataService | null>(null)

  // sql
  const [result, setResult] = useState<any>(undefined)
  const [query, setQuery] = useState<string>("")

  const [scheme, setScheme] = useState<keyof typeof d3Bivariate>("RdBu")
  const [colorresult, setColorResult] = useState<any>(undefined)

  useEffect(() => {
    const init = async () => {
      const prevquery = localStorage.getItem("query")
      if (prevquery) {
        setQuery(prevquery)
      }
      await _ds?.initDb()
      await _ds?.initData()
      setDs(_ds)
    }
    if (ds === null) {
      init()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("query", query)
  }, [query])

  const runQuery = async (query: string) => {
    const res = await ds?.runQuery(query)
    // @ts-ignore
    setResult(JSON.parse(JSON.stringify(res)))
  }

  const runColors = async () => {
    // const res = await ds?.getBivariateColorValues(
    //   ["GEOID", "GEOID"], 
    //   scheme,
    //   ["2020", "2020"], //col
    //   ["data/concentration_metrics_wide.parquet", "data/gravity_no_dollar_pivoted.parquet"], // table
    // )
    // setColorResult(res?.colorMatrix)
    // console.log(res)
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4">Playground</h1>
      {ds === null ? (
        <p className="p-5 text-center">Loading...</p>
      ) : (
        <>
        <h3>SQL</h3>
          <p>
            <i>
              Type your SQL query below using DuckDb syntax. Press alt+enter to execute your query. Your previous query
              will automatically load (on this browser/computer).
            </i>
          </p>
          <hr className="my-4" />
          {/* 20 line text input */}
          <textarea
            className="h-48 w-full border-2 p-2"
            placeholder="Enter query here"
            defaultValue={query}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.altKey) {
                runQuery(e.currentTarget.value)
                setQuery(e.currentTarget.value)
              }
            }}
          ></textarea>
          <hr className="my-4" />
          <h3>Result:</h3>
          <pre className="block max-h-96 w-full overflow-y-auto bg-neutral-900 p-2 text-white">
            {JSON.stringify(result, null, 2)}
            {result == undefined && "No result yet. Please run a query."}
          </pre>
          <hr className="my-4" />
          <h3>Colors</h3>
          {/* two inputs with d3Keys */}
          {/* on change set scheme1 or scheme2 */}
          <div className="flex space-x-4">
            <select
              className="w-1/2"
              value={scheme}
              onChange={(e) => setScheme(e.target.value as keyof typeof d3Bivariate)}
            >
              {colorKeys.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            {/* button to run color query */}
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={runColors}
            >
              Run
            </button>
          </div>

          <div className="w-96 h-96">
            {/* @ts-ignore */}
                {colorresult?.map((row, i) => {
                  console.log(row)
                  return (
                    <div key={i} className="flex">
                      {/* @ts-ignore */}
                      {row.map((col, j) => {
                        return (
                          <div
                            key={j}
                            className="w-8 h-8 m-0"
                            style={{
                              backgroundColor: `rgba(${col.join(",")})`,
                            }}
                          ></div>
                        )
                      })}
                    </div>
                  )


                }
              )}
            </div>
          
        </>
      )}
    </div>
  )
}
