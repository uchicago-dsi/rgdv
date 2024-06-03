"use client"
import { createContext, useContext, useState } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"

export const ComparabilityContext = createContext({
  comparability: "national",
  setComparability: (comparability: string) => {},
  options: ["national"] as readonly string[],
})

export default function ComparabilityProvider({ comparabilityOptions, children }: { comparabilityOptions: readonly string[], children: React.ReactNode }) {
  const [_comparability, setComparability] = useLocalStorage<string>("national")
  const [options] = useState(comparabilityOptions)
  const comparability = !_comparability ? "national" : !options.includes(_comparability) ? options[0]! : _comparability!

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