"use client"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import CountyFilterSelector from "components/CountyFilterSelector"

const StatePage: React.FC = () => {
  const [filter, setFilter] = useState<string>("")
  const router = useRouter()
  const handleChange = (e: string) => {
    if (e.length === 2) {
      setFilter(e)
      router.push(`/state/${e}`)
    } 
  }

  return (
    <div className="bg-canvas-500 align-center flex min-h-[100vh] items-center justify-center p-8">
      <div className="bg-white p-8 shadow-xl min-w-[50vw] min-h-[20vh]">
        {filter.length === 2 ? (
          <code>Loading, please wait...</code>
        ) : (
          <>
            <h1 className="mb-4 text-2xl">State Home Page</h1>
            <CountyFilterSelector currentFilter={filter} handleSetFilter={handleChange} />
          </>
        )}
      </div>
    </div>
  )
}

export default StatePage
