"use client"
import { useState } from "react"

export const WipTag = () => {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null
  return (
    <button
      className="z-100 fixed bottom-4 right-4 max-w-44 rounded-sm bg-blue-300 p-2 text-xs shadow-md"
      onClick={() => setHidden(true)}
    >
      We&apos;re still working on this site. Please note that data, findings, and visualizations are subject to change.
      <br />
      <br />
      Click here to dismiss this message.
    </button>
  )
}
