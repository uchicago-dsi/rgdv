"use client"
import { useEffect } from "react"

const DomEvents = () => {
  useEffect(() => {
    // Code to run after the DOM has loaded
    console.log("DOM is fully loaded")
    // Example of firing a custom event
    const event = new Event("domLoaded")
    typeof window !== "undefined" && window.dispatchEvent(event)
    return () => {
      console.log("unmounted...")
    }
  }, []) // Empty dependency array means this runs once after the initial render

  return null
}

export default DomEvents
