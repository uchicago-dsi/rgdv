"use client"
import { createContext, useContext, useState } from "react"

export const ComparabilityContext = createContext({
  comparability: "national",
  setComparability: (comparability: string) => {},
  options: ["national"] as readonly string[],
})

export default function ComparabilityProvider({ comparabilityOptions, children }: { comparabilityOptions: readonly string[], children: React.ReactNode }) {
  const [comparability, setComparability] = useState("national")
  const [options] = useState(comparabilityOptions)
  return (
    <ComparabilityContext.Provider
      value={{
        comparability,
        setComparability,
        options
      }}
    >
      {children}
    </ComparabilityContext.Provider>
  )
}

export const useComparability = () => {
  const { comparability, setComparability, options } = useContext(ComparabilityContext)

  return {
    comparability,
    setComparability,
    options
  }
}