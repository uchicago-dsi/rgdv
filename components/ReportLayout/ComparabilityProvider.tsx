"use client"
// import { useLocalStorage } from "@uidotdev/usehooks"
import { createContext, useContext, useState } from "react"

export const ComparabilityContext = createContext({
  comparability: "national",
  setComparability: (_comparability: string) => {},
  options: ["national"] as readonly string[],
})

const _comparability = "national"
const setComparability = (_comparability: string) => {}
export default function ComparabilityProvider({
  comparabilityOptions,
  children,
}: {
  comparabilityOptions: readonly string[]
  children: React.ReactNode
}) {
  // const [_comparability, setComparability] = useLocalStorage<string>("national")
  const [options] = useState(comparabilityOptions)
  const comparability = !_comparability ? "national" : !options.includes(_comparability) ? options[0]! : _comparability!

  return (
    <ComparabilityContext.Provider
      value={{
        comparability,
        setComparability,
        options,
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
    options,
  }
}
