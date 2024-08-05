import { CheckboxIcon } from "@radix-ui/react-icons"
import * as Select from "@radix-ui/react-select"
import React from "react"
import { SelectMenu } from "components/Select/Select"
import CountyList from "./county_list.json"
import type { CountyFilterSelectorProps } from "./types"

const StyledSelectItem: React.FC<{ children: React.ReactNode; value: any, disabled?: boolean }> = ({ children, value, disabled=false }) => {
  return (
    <Select.Item
    disabled={disabled}
      className={`
        ${disabled ? "text-bold text-black" : "text-violet11"}
        SelectItem relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-violet11 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 data-[highlighted]:outline-none`}
      value={value as string}
    >
      {children}
    </Select.Item>
  )
}

export const CountyFilterSelector: React.FC<CountyFilterSelectorProps> = ({ handleSetFilter, currentFilter, size }) => {
  const _fontSize = size
  const filterState = currentFilter?.length ? currentFilter.slice(0, 2) : ""
  const currentData = currentFilter?.length ? CountyList.find((state) => state.statefp === filterState) : ({} as any)
  const currentState = currentData?.state || "Choose a State"
  const currentCounties = currentData?.counties ? currentData?.counties : []
  const currentCounty = currentCounties?.find((county: any) => county.fips === currentFilter)?.name || "Choose a County"

  return (
    <div>
      <SelectMenu title="Filter by state" value={currentState} onValueChange={handleSetFilter}>
        <>
          <StyledSelectItem value={currentState} disabled>
            <Select.ItemText>{currentState || "Choose a State"}</Select.ItemText>
            <Select.ItemIndicator className="SelectItemIndicator">
              <CheckboxIcon />
            </Select.ItemIndicator>
          </StyledSelectItem>
          {/* @ts-ignore */}
          <StyledSelectItem value={null}>
            <Select.ItemText>All</Select.ItemText>
            <Select.ItemIndicator className="SelectItemIndicator">
              <CheckboxIcon />
            </Select.ItemIndicator>
          </StyledSelectItem>
          {CountyList.map((state, i) => (
            <StyledSelectItem value={state.statefp} key={i}>
              <Select.ItemText>{state.state}</Select.ItemText>
              <Select.ItemIndicator className="SelectItemIndicator">
                <CheckboxIcon />
              </Select.ItemIndicator>
            </StyledSelectItem>
          ))}
        </>
      </SelectMenu>
      {currentCounties.length > 0 && (
        <SelectMenu title="Filter by county" value={currentCounty} onValueChange={handleSetFilter}>
          <>
            <StyledSelectItem value={currentCounty}>
              <Select.ItemText>{currentCounty || "Choose a County"}</Select.ItemText>
              <Select.ItemIndicator className="SelectItemIndicator">
                <CheckboxIcon />
              </Select.ItemIndicator>
            </StyledSelectItem>
            {currentCounties.map((county: any, i: number) => (
              <StyledSelectItem value={county.fips} key={i}>
                <Select.ItemText>{county.name}</Select.ItemText>
                <Select.ItemIndicator className="SelectItemIndicator">
                  <CheckboxIcon />
                </Select.ItemIndicator>
              </StyledSelectItem>
            ))}
          </>
        </SelectMenu>
      )}
    </div>
  )
}
