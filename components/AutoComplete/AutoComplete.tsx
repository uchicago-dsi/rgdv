import React, { useState, useEffect, useCallback, useRef } from "react"
import { TextField, Box } from "@radix-ui/themes"
import debounce from "lodash.debounce"

interface AutoCompleteProps {
  dataCallback: (s: string) => Promise<Array<Record<string, unknown>>>
  onClick?: (item: Record<string, unknown>) => void
  listTitleProperty: string // key of data to show in list
  listSubtitleProperty?: string // key of data to show in list
  delay?: number // default 300
  placeholder?: string
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  delay = 300,
  dataCallback,
  onClick,
  listTitleProperty,
  listSubtitleProperty,
  placeholder,
}) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Array<Record<string, unknown>>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchResults = useCallback(
    debounce(async (searchText: string) => {
      if (searchText) {
        setIsLoading(true)
        try {
          const data = await dataCallback(searchText)
          setResults(data)
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
      }
    }, delay),
    [debounce, dataCallback]
  )

  useEffect(() => {
    fetchResults(query)
  }, [query, fetchResults])

  const handleBlur = (event: React.FocusEvent) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setIsFocused(false)
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <TextField.Root
        type="text"
        variant="soft"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder || "Search..."}
        className="
          w-full max-w-none rounded border border-gray-300 bg-none p-2 
          [&>*]:w-full
          [&>input]:bg-black/0
          [&>*]:text-white
          
          "
      >
        <TextField.Slot />
      </TextField.Root>
      {isFocused &&
        (isLoading ? (
          <Box className="absolute mt-1 w-full rounded border bg-neutral-900 border-gray-300 p-2">Loading...</Box>
        ) : (
          results.length > 0 && (
            <Box className="absolute mt-1 w-full rounded border bg-neutral-900 border-gray-300 p-2">
              <ul>
                {results.map((item, index) => (
                  <li key={index} className="hover:bg-primary-500 cursor-pointer p-1">
                    <button
                      onClick={() => {
                        setQuery(item[listTitleProperty] as string)
                        setResults([])
                        if (onClick) {
                          onClick(item)
                        }
                      }}
                    >
                      {item[listTitleProperty] as string}
                      {!!listSubtitleProperty && !!item[listSubtitleProperty] && (
                        <span>{item[listSubtitleProperty] as string}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </Box>
          )
        ))}
    </div>
  )
}

export default AutoComplete
