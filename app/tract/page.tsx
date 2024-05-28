"use client"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import CountyFilterSelector from "components/CountyFilterSelector"
import MapComponent from "components/Map/Map"

const StatePage: React.FC = () => {
  const [filter, setFilter] = useState<string>("")
  // const [tracts, setTracts] = useState<any[]>([])
  // const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const router = useRouter()
  const isTractId = !!(filter?.length === 11)
  const isCountyFilter = Boolean(filter?.length === 5)
  const handleChange = (e: string) => {
    if (Number.isNaN(Number(e))) return
    if (e.length === 11) {
      setFilter(e)
      router.push(`/tract/${e}`)
    } else {
      setFilter(e)
    }
  }

  // useEffect(() => {
  //   if (filter.length === 5) {
  //     setLoadingStatus(true)
  //     fetch(`/api/tract-ids/${filter}`)
  //       .then((res) => (res.ok ? res.json() : Promise.reject(res)))
  //       .then((data) => {
  //         if (Array.isArray(data)) {
  //           setTracts(data)
  //           setLoadingStatus(false)
  //         }
  //       })
  //   } else {
  //     setTracts([])
  //     setLoadingStatus(false)
  //   }
  // }, [filter])

  return (
    <div className="prose max-w-none bg-canvas-500 align-center flex min-h-[100vh] items-center justify-center p-8">
      <div className="min-h-[20vh] min-w-[50vw] bg-white p-8 shadow-xl">
        {isTractId ? (
          <code>Loading, please wait...</code>
        ) : (
          <>
            <h1 className="mb-4 text-2xl">Tract (neighborhood) Home Page</h1>
            <CountyFilterSelector currentFilter={filter} handleSetFilter={handleChange} />
            {isCountyFilter && (
              <div className="">
                <h3>Click a census tract to see it&apos;s report:</h3>
                <div className="my-2 flex flex-row items-center gap-4 p-2">
                  <div className="relative h-[50vh] max-w-full">
                    <MapComponent
                      onClick={(e) => handleChange(e?.object?.properties?.GEOID)}
                      initialFilter={filter}
                      simpleMap={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default StatePage
