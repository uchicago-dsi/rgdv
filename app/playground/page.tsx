"use client"
import { useEffect, useRef, useState } from "react"
import { MemoryMonitor } from "components/dev/MemoryMonitor"

export default function Playground() {
  const isRunning = useRef<boolean>(false)

  return (
    <div>
      <MemoryMonitor />
      <h1>Playground</h1>
    </div>
  )
}
