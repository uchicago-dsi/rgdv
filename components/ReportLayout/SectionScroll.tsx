"use client"
import React, { useEffect, useState } from "react"

function smoothScrollToSection(sectionId: string) {
  // Find the section element by its ID
  const section = document.getElementById(sectionId)

  // Check if the section exists
  if (section) {
    // Use the scrollIntoView method with smooth behavior
    section.scrollIntoView({ behavior: "smooth", block: "center" })
  } else {
    console.warn(`Section with ID ${sectionId} not found.`)
  }
}

export const SectionScroll: React.FC<{
  sections: Array<{
    id: string
    key: string
    Component: string
  }>
}> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState(sections?.[0]?.id)

  useEffect(() => {
    // on load listen for divs entering the viewport
    // set active to div id
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "0px", threshold: 0.75 }
    )
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })
    return () => {
      observer.disconnect()
    }
  }, [sections])

  return (
    <>
      {sections.map((section) => (
        // jump to id of section.key on click
        <li key={`li-${section.key}`} className="cursor-pointer">
          <button
            className={`${activeSection === section.id ? "text-blue-500" : "text-gray-500"} m-0 py-0`}
            onClick={() => smoothScrollToSection(section.id)}
          >
            {section.key}
          </button>
        </li>
      ))}
    </>
  )
}
