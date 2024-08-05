"use client"
import React, { use, useEffect, useState } from "react"
import Spinner from "components/Spinner"
import { usePathname } from "next/navigation"

export const ReportLoadingShade: React.FC<{loading:any}> = ({ loading }) => {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => setIsLoading(false), [pathname])
  useEffect(() => setIsLoading(true), [loading])
  
  if (!isLoading) return null

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center gap-4 bg-white/75">
      <Spinner />
      <h3 className="text-4xl">Report is loading...</h3>
    </div>
  )
}
