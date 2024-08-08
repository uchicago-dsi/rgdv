"use client"
import { useRouter } from "next/navigation"
import AutoComplete from "components/AutoComplete/AutoComplete"

const fetchData = (s: string) => fetch(`/api/names?search=${s}`).then((res) => res.json() as any)

export const PlaceSearch = () => {
  const router = useRouter()
  const onClick = (item: any) => {
    const unit = item.UNIT.toLowerCase()
    router.push(`/${unit}/${item.GEOID}`)
  }

  return (
    <span className="not-prose">
      <AutoComplete
        dataCallback={fetchData}
        listTitleProperty="NAME"
        placeholder="Search for a state, county, or census tract ID"
        // onFocusValue={"Cook"}
        onClick={onClick}
      />
    </span>
  )
}
