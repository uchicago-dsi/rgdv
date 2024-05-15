"use client"
import React, { useEffect, useState } from "react"
import CountyFilterSelector from "components/CountyFilterSelector"
import { useRouter } from "next/navigation"
import { SelectMenu } from "components/Select/Select"
import * as Select from "@radix-ui/react-select"

const StatePage: React.FC = () => {
  const [filter, setFilter] = useState<string>("")
  const [tracts, setTracts] = useState<any[]>([])
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const router = useRouter()
  const isTractId = !!(filter?.length === 11)

  const handleChange = (e: string) => {
    if (e.length === 11) {
      setFilter(e)
      router.push(`/tract/${e}`)
    } else {
      setFilter(e)
    }
  }

  useEffect(() => {
    if (filter.length === 5) {
      setLoadingStatus(true)
      fetch(`/api/tract-ids/${filter}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((data) => {
          if (Array.isArray(data)) {
            setTracts(data)
            setLoadingStatus(false)
          }
        })
    } else {
      setTracts([])
      setLoadingStatus(false)
    }
  }, [filter])

  return (
    <div className="bg-canvas-500 align-center flex min-h-[100vh] items-center justify-center p-8">
      <div className="min-h-[20vh] min-w-[50vw] bg-white p-8 shadow-xl">
        {isTractId ? (
          <code>Loading, please wait...</code>
        ) : (
          <>
            <h1 className="mb-4 text-2xl">Tract (neighborhood) Home Page</h1>
            <CountyFilterSelector currentFilter={filter} handleSetFilter={handleChange} />
            {loadingStatus && <p>Loading Tracts...</p>}
            {tracts.length > 0 && (<>
            <div className="p-2 my-2 flex flex-row gap-4 items-center">
              <h3>Tracts:</h3>
              <SelectMenu title="Filter by state" value={filter} onValueChange={handleChange}>
                {tracts.map((tract, i) => (
                  <Select.Item className="SelectItem" value={tract} key={i}>
                    <Select.ItemText>{tract}</Select.ItemText>
                  </Select.Item>
                ))}
              </SelectMenu>
              </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default StatePage
