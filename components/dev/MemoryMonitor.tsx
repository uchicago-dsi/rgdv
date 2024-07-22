// @ts-nocheck
"use client"
import { useEffect, useRef, useState } from "react"

export const MemoryMonitor = () => {
  const [memoryUsed, setMemoryUsed] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (intervalRef.current == null) {
      intervalRef.current = setInterval(() => {
        try {
          const mem = performance?.memory?.usedJSHeapSize && performance?.memory?.usedJSHeapSize / Math.pow(1000, 2)
          setMemoryUsed(mem)
        } catch {}
      }, 250)
      return () => clearInterval(intervalRef)
    }
  }, [])

  return (
    <div
      className="absolute bottom-2 right-2 rounded-xl
    bg-red-500 p-1 text-xs text-white
    "
    >
      memory used: {Math.round(memoryUsed * 10) / 10}MB
    </div>
  )
}
