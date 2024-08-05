import React from "react"

// context for pageInfo and stats
const MarkdownContext = React.createContext<{ pageInfo: any; stats: any }>({
  pageInfo: null,
  stats: null,
})

export const useMarkdownContextProvider = ({ pageInfo, stats }: { pageInfo: any; stats: any }) => {
  return ({ children }: any) => {
    return <MarkdownContext.Provider value={{ pageInfo, stats }}>{children}</MarkdownContext.Provider>
  }
}

export const useMarkdownContext = () => {
  const context = React.useContext(MarkdownContext)
  if (!context) {
    throw new Error("useMarkdownContext must be used within a MarkdownContextProvider")
  }

  return context
}
