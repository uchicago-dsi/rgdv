import React from "react"
import "./Spinner.css"

export const Spinner: React.FC = () => {
  return (
    <svg className="spinner" width="2rem" height="2rem" viewBox="0 0 50 50">
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
    </svg>
  )
}
