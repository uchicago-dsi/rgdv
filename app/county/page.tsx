"use client"
import CountyFilterSelector from "components/CountyFilterSelector"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

const CountyPage: React.FC = () => {
  const [filter, setFilter] = useState<string>("")
  const router = useRouter()
  const handleChange = (e: string) => {
    //`${number}${number}` | `${number}${number}${number}${number}${number}`
    if (e.length === 5) {
      router.push(`/county/${e}`)
    } else {
      setFilter(e)
    }
  }
  return (
    <div className="bg-canvas-500 align-center flex min-h-[100vh] items-center justify-center p-8">
      <div className="bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-2xl">County Home Page</h1>
        <CountyFilterSelector currentFilter={filter} handleSetFilter={handleChange} />
      </div>
    </div>
  )
}

export default CountyPage