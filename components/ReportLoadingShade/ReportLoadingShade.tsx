"use client"
import React, { useEffect, useState } from "react"
import Spinner from "components/Spinner"
import { usePathname } from "next/navigation"

export const ReportLoadingShade: React.FC<{ forceLoading?: boolean }> = ({ forceLoading }) => {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => setIsLoading(false), [pathname])

  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      setIsLoading(true)
    })
  }, [])

  if (!isLoading && !forceLoading) return null

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white/50">
      <div className="flex flex-col items-center justify-center bg-white p-4 gap-4 shadow-xl border-radius-4">
      <Spinner />
      <h3 className="text-4xl">Loading...</h3>
      </div>
    </div>
  )
}
