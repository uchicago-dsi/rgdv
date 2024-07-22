import { useEffect, useState } from "react"
import { loadParquet } from "./duckdb"

/**
 * Hook for loading a parquet file or URL; starts out `null`, gets populated asynchronously
 */
export function useParquet<T>(url?: string): T[] | null {
  const [data, setData] = useState<T[] | null>(null)
  useEffect(() => {
    if (!url) return
    loadParquet<T>(url).then((data) => setData(data))
  }, [])
  return data
}
