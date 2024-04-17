"use client"
import { useRouter } from "next/navigation"
import React from "react"
import CountyFilterSelector from "components/CountyFilterSelector"

const StatePage: React.FC = () => {
  const router = useRouter()
  const handleChange = (e: string) => {
    router.push(`/state/${e}`)
  }
  return (
    <div className="bg-canvas-500 align-center flex min-h-[100vh] items-center justify-center p-8">
      <div className="bg-white p-8 shadow-xl">
        <h1 className="mb-4 text-2xl">State Home Page</h1>
        <CountyFilterSelector handleSetFilter={handleChange} />
      </div>
    </div>
  )
}

export default StatePage
