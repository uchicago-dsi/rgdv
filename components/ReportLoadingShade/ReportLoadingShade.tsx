"use client"
import { usePathname } from "next/navigation"
import React, { useEffect, useState } from "react"
import Spinner from "components/Spinner"

export const ReportLoadingShade: React.FC<{ forceLoading?: boolean }> = ({ forceLoading }) => {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => setIsLoading(false), [pathname])

  useEffect(() => {
    window.addEventListener("beforeunload", (_) => {
      setIsLoading(true)
    })
  }, [])

  if (!isLoading && !forceLoading) return null

  return (
    <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-white/50">
      <div className="border-radius-4 flex flex-col items-center justify-center gap-4 bg-white p-4 shadow-xl">
        <Spinner />
        <h3 className="text-4xl">Loading...</h3>
      </div>
    </div>
  )
}
