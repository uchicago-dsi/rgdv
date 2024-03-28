import React from "react"
import type { CountyFilterSelectorProps } from "./types"
import { SelectMenu } from "components/Select/Select"
import * as Select from "@radix-ui/react-select"
import { CheckboxIcon } from "@radix-ui/react-icons"
import CountyList from "./county_list.json"

export const CountyFilterSelector: React.FC<CountyFilterSelectorProps> = ({ handleSetFilter, currentFilter }) => {
  const filterState = currentFilter?.length ? currentFilter.slice(0, 2) : ""
  const currentData = currentFilter?.length ? CountyList.find((state) => state.statefp === filterState) : ({} as any)
  const currentState = currentData?.state || "Choose a State"
  const currentCounties = currentData?.counties ? currentData?.counties : []
  const currentCounty = currentCounties?.find((county: any) => county.fips === currentFilter)?.name || "Choose a County"

  return (
    <div>
      <SelectMenu title="Filter by state" value={currentState} onValueChange={handleSetFilter}>
        <>
            <Select.Item className="SelectItem" value={currentState}>
              <Select.ItemText>{currentState || "Choose a State"}</Select.ItemText>
              <Select.ItemIndicator className="SelectItemIndicator">
                <CheckboxIcon />
              </Select.ItemIndicator>
            </Select.Item>
          {CountyList.map((state, i) => (
            <Select.Item className="SelectItem" value={state.statefp as string} key={i}>
              <Select.ItemText>{state.state}</Select.ItemText>
              <Select.ItemIndicator className="SelectItemIndicator">
                <CheckboxIcon />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </>
      </SelectMenu>
      {currentCounties.length > 0 && (
      <SelectMenu title="Filter by county" value={currentCounty} onValueChange={handleSetFilter}>
        <>

        <Select.Item className="SelectItem" value={currentCounty}>
              <Select.ItemText>{currentCounty || "Choose a County"}</Select.ItemText>
              <Select.ItemIndicator className="SelectItemIndicator">
                <CheckboxIcon />
              </Select.ItemIndicator>
            </Select.Item>
          {currentCounties.map((county: any, i: number) => (
            <Select.Item className="SelectItem" value={county.fips} key={i}>
              <Select.ItemText>{county.name}</Select.ItemText>
              <Select.ItemIndicator className="SelectItemIndicator">
                <CheckboxIcon />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </>
      </SelectMenu>
        )}
    </div>
  )
}
