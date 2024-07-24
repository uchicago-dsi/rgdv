import { Box, TextField } from "@radix-ui/themes"
import debounce from "lodash.debounce"
import React, { useCallback, useEffect, useRef, useState } from "react"

interface AutoCompleteProps {
  dataCallback: (s: string) => Promise<Array<Record<string, unknown>>>
  onClick?: (item: Record<string, unknown>) => void
  listTitleProperty: string // key of data to show in list
  listSubtitleProperty?: string // key of data to show in list
  delay?: number // default 300
  placeholder?: string
  onFocusValue?: string
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  delay = 300,
  dataCallback,
  onClick,
  onFocusValue,
  listTitleProperty,
  listSubtitleProperty,
  placeholder,
}) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Array<Record<string, unknown>>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [noResults, setNoResults] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchResults = useCallback(
    debounce(async (searchText: string) => {
      if (searchText) {
        setIsLoading(true)
        setNoResults(false)
        try {
          const data = await dataCallback(searchText)
          if (!data.length) setNoResults(true)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debounce, dataCallback]
  )

  useEffect(() => {
    fetchResults(query)
  }, [query, fetchResults])

  const handleBlur = (event: React.FocusEvent) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setIsFocused(false)
      setQuery("")
    }
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <TextField.Root
        type="text"
        variant="soft"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          setIsFocused(true)
          if (onFocusValue) {
            setQuery(p => !p?.length ? onFocusValue : p)
          }
        }}

        onBlur={handleBlur}
        placeholder={placeholder || "Search..."}
        className="
          w-full max-w-none rounded border border-gray-300 bg-none p-2 
          [&>*]:w-full
          [&>*]:text-white
          [&>input]:bg-black/0
          
          "
      >
        <TextField.Slot />
      </TextField.Root>
      {isFocused &&
        (isLoading ? (
          <Box className="absolute mt-1 w-full rounded border border-gray-300 bg-neutral-900 p-2">Loading...</Box>
        ) : noResults ? (
          <Box className="absolute mt-1 w-full rounded border border-gray-300 bg-neutral-900 p-2">No matches found. Please search again.</Box>

        )
        : (
          results.length > 0 && (
            <Box className="absolute mt-1 w-full rounded border border-gray-300 bg-neutral-900 p-2">
              <ul>
                {results.map((item, index) => (
                  <li key={index} className="cursor-pointer p-1 hover:bg-primary-500">
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
