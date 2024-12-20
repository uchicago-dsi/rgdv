"use client"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import CountyFilterSelector from "components/CountyFilterSelector"
import { ReportLoadingShade } from "components/ReportLoadingShade/ReportLoadingShade"

const CountyPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("")
  const router = useRouter()
  const handleChange = (e: string) => {
    //`${number}${number}` | `${number}${number}${number}${number}${number}`
    if (e.length === 5) {
      setFilter(e)
      router.push(`/county/${e}`)
    } else if (e.length === 2) {
      setFilter(e)
    }
  }

  return (
    <div className="bg-canvas-500 align-center flex min-h-[100vh] items-center justify-center p-8">
      <div className="min-h-[20vh] min-w-[50vw] bg-white p-8 shadow-xl">
        <ReportLoadingShade forceLoading={filter.length === 5} />
        <h1 className="mb-4 text-2xl">County Home Page</h1>
        <CountyFilterSelector currentFilter={filter} handleSetFilter={handleChange} />
      </div>
    </div>
  )
}

export default CountyPage
