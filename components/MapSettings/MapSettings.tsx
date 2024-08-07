"use client"
import React, { useMemo, useState } from "react"
import CountyFilterSelector from "components/CountyFilterSelector"
import { EnhancedMarkdown } from "components/EnhancedMarkdown"
import { MapInfoSection } from "components/MapInfoSection/MapInfoSection"
import { StatefulHighlightColorPicker } from "components/StatefulControls/StatefulHighlightColorPicker"
import { StatefulHighlightForm } from "components/StatefulControls/StatefulMapFilterSlider"
import Tooltip from "components/Tooltip"
import { useMarkdownContext } from "hooks/useMarkdownContext"
import { columnGroups, communityHighlightConfig, parentCompanyHighlightConfig } from "utils/data/config"
import { setCurrentColumn, setCurrentColumnGroup, setHighlight } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"
import { fetchCentroidById } from "utils/state/thunks"
import { MenuButton } from "./MapMenuButton"
import { MenuSection } from "./MapMenuSection"
import { Icons, MapSettingsIcon } from "./MapSettingsIcon"

const SettingsConfig: Array<{ label: string; icon: keyof typeof Icons }> = [
  {
    label: "Map Layers",
    icon: "Layers",
  },
  {
    label: "Map Highlights",
    icon: "Highlight",
  },
  {
    label: "Filter Map",
    icon: "Filter",
  },
]

const contentSectionTitles = [
  "topics",
  "available data",
  "market highlights",
  "community highlights",
  "highlight advanced",
  "filter map",
]
const nullSections: any[] = []

const findContentSections = (contentSections: any[], titles: string[] = contentSectionTitles) => {
  const entries: Record<string, React.ReactNode> = {}
  for (const title of titles) {
    const data: any = contentSections.find((section) => section.title === title)
    entries[title] = data ? <EnhancedMarkdown content={data.body} /> : null
  }
  return entries
}

export const MapSettings: React.FC = () => {
  const md = useMarkdownContext()
  const contentSections = md?.pageInfo?.data?.page?.sections || nullSections
  const sections = useMemo(() => (contentSections ? findContentSections(contentSections) : {}), [contentSections])

  const [activeMenuSection, setActiveMenuSection] = useState<string | undefined>(undefined)

  const currentColumn = useAppSelector((state) => state.map.currentColumn)
  const currentColumnGroup = useAppSelector((state) => state.map.currentColumnGroup)
  const availableColumns = columnGroups[currentColumnGroup]?.columns || []
  const highlight = useAppSelector((state) => state.map.highlight)
  const filter = useAppSelector((state) => state.map.idFilter)
  const clicked = useAppSelector((state) => state.map.clicked)

  // @ts-ignore
  const highlightType = !highlight ? "none" : communityHighlightConfig[highlight] ? "community" : "parent"
  const dispatch = useAppDispatch()
  const handleSetColumn = (col: string | number) => dispatch(setCurrentColumn(col as any))
  const handleSetColumnGroup = (group: string) => dispatch(setCurrentColumnGroup(group))
  const handleSetFilter = (filter: string) => dispatch(fetchCentroidById(filter))

  const handleMenuButton = (label: string) => {
    setActiveMenuSection((prev) => (prev === label ? undefined : label))
  }

  return (
    <>
      <div className={`h-full w-10 flex-none border-r-2 border-neutral-500 bg-white`} id="map-settings-ribbon">
        {SettingsConfig.map((config, i) => (
          <button
            key={i}
            onClick={() => handleMenuButton(config.label)}
            className="m-0 box-border flex size-full h-12 cursor-pointer items-center justify-center bg-white p-2 transition-all
        hover:bg-primary-100
      "
          >
            <MapSettingsIcon isActive={activeMenuSection === config.label} icon={config.icon} />
          </button>
        ))}
      </div>
      <div className={`flex w-auto flex-none flex-col overflow-x-hidden bg-none`} id="map-settings-pane">
        {!!clicked && (
          <div
            className={`${!!activeMenuSection ? "max-h-[50vh]" : "max-h-none"} h-full overflow-y-auto
        border-b-2 border-neutral-500
        `}
          >
            <MapInfoSection />
          </div>
        )}
        {!!activeMenuSection?.length && (
          <div
            className={`relative flex  h-full overflow-y-auto ${
              activeMenuSection ? "w-96 border-r-2 border-neutral-500" : "w-0"
            } flex-col`}
          >
            {!!activeMenuSection && (
              <button
                onClick={() => setActiveMenuSection(undefined)}
                className="absolute right-0 top-0 cursor-pointer
          p-2 transition-all hover:text-red-500
        "
              >
                &times;
              </button>
            )}
            <MenuSection title="Topics" isActive={activeMenuSection === "Map Layers"}>
              {sections["topics"]}
              <br />
              {Object.keys(columnGroups).map((group, i) => (
                <MenuButton
                  key={i}
                  onClick={() => handleSetColumnGroup(group)}
                  label={group}
                  selected={currentColumnGroup === group}
                />
              ))}
            </MenuSection>
            <MenuSection title="Available Data" isActive={activeMenuSection === "Map Layers"}>
              {sections["available data"]}
              <br />
              {availableColumns.map((c, i) => (
                <MenuButton key={i} onClick={() => handleSetColumn(c)} label={c} selected={currentColumn === c} />
              ))}
            </MenuSection>

            <MenuSection
              isActive={activeMenuSection === "Map Highlights"}
              title="Highlight areas on the map"
              titleChildren={<Tooltip explainer={<>Choose a color</>}></Tooltip>}
            >
              <br />
              {sections["community highlights"]}
              <br />
              <br />
              {Object.keys(communityHighlightConfig).map((name, i) => (
                <MenuButton
                  key={i}
                  onClick={() =>
                    highlight === name ? dispatch(setHighlight(undefined)) : dispatch(setHighlight(name as any))
                  }
                  label={name}
                  selected={highlight === name}
                />
              ))}
              {highlightType === "community" && (
                <>
                  <br />
                  <br />
                  <StatefulHighlightForm />
                </>
              )}
              <br />
              <br />
              {sections["market highlights"]}
              <br />
              <br />

              {Object.keys(parentCompanyHighlightConfig).map((name, i) => (
                <MenuButton
                  key={i}
                  onClick={() =>
                    highlight === name ? dispatch(setHighlight(undefined)) : dispatch(setHighlight(name as any))
                  }
                  label={name}
                  selected={highlight === name}
                />
              ))}
              {highlightType === "parent" && (
                <>
                  <br />
                  <br />
                  <StatefulHighlightForm />
                </>
              )}
              <div className="mt-4 flex flex-row items-center gap-4">
                {sections["highlight advanced"]}
                <StatefulHighlightColorPicker />
              </div>

              {/* color picker */}
            </MenuSection>
            <MenuSection title="Filter Map" isActive={activeMenuSection === "Filter Map"}>
              {sections["filter map"]}
              <br />
              <br />
              {Array.isArray(filter) ? (
                <CountyFilterSelector handleSetFilter={handleSetFilter} currentFilter={filter[0]} />
              ) : (
                <CountyFilterSelector handleSetFilter={handleSetFilter} currentFilter={filter} />
              )}
            </MenuSection>
            {/* <MenuSection title="Map Colors" isActive={activeMenuSection === "Map Colors"}>
              fixed or relative [coming soon]
            </MenuSection> */}
            {/* <DropdownMenuDemo>
      <div className="max-w-[100vw] p-4">
        <p>Choose a topic</p>
        <hr />
        <div
          style={{
            maxWidth: "30vw",
          }}
        >
          <SelectMenu
            title="Choose a topic"
            value={currentColumnGroup || ""}
            onValueChange={(e) => handleSetColumnGroup(e)}
          >
            <>
              {Object.keys(columnGroups).map((group, i) => (
                <Select.Item className="SelectItem" value={group} key={i}>
                  <Select.ItemText>{group || "Choose a topic"}</Select.ItemText>
                  <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckboxIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </>
          </SelectMenu>
        </div>
        <hr className="my-2" />
        <p>Available data</p>

        <div
          style={{
            maxWidth: "30vw",
          }}
        >
          <SelectMenu
            title="Choose a map variable"
            value={currentColumnSpec.name}
            onValueChange={(e) => handleSetColumn(e)}
          >
            <>
              {availableColumns.map((c, i) => (
                <Select.Item className="SelectItem" value={c} key={i}>
                  <Select.ItemText>{c || "Variable"}</Select.ItemText>
                  <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckboxIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </>
          </SelectMenu>
        </div>
        <hr className="my-2" />
        <p>Filter</p>
        <CountyFilterSelector handleSetFilter={handleSetFilter} currentFilter={filter} />
      </div>
    </DropdownMenuDemo> */}
          </div>
        )}
      </div>
    </>
  )
}
