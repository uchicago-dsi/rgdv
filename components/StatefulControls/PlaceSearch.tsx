"use client"
import AutoComplete from "components/AutoComplete/AutoComplete"
import { useRouter } from "next/navigation"

const fetchData = (s: string) => fetch(`/api/names?search=${s}`).then((res) => res.json() as any)

export const PlaceSearch = () => {
  const router = useRouter()
  const onClick = (item: any) => {
    const unit = item.UNIT.toLowerCase()
    router.push(`/${unit}/${item.GEOID}`)
  }

  return <AutoComplete dataCallback={fetchData} listTitleProperty="NAME" 
    placeholder="Search for a state, county, or census tract **NOT ADDRESS**" onClick={onClick}
  />
}