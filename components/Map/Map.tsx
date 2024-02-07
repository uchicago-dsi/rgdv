"use client"
import { store, useAppDispatch, useAppSelector } from "utils/state/store"
import { setCurrentColumn, setTooltipInfo, setYear } from "utils/state/map"
import { Provider, useSelector } from "react-redux"
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed"
import GlMap, { NavigationControl, useControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import React, { useRef } from "react"
import { MVTLayer } from "@deck.gl/geo-layers/typed"
import DropdownMenuDemo from "components/Dropdown/Dropdown"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useDataService } from "utils/hooks/useDataService"
import "./styles.css"
import config from "utils/data/config"
import { SelectMenu } from "components/Select/Select"
import * as Select from "@radix-ui/react-select"
import { CheckIcon } from "@radix-ui/react-icons"
import { DataService } from "utils/data/service"

const BreakText: React.FC<{ breaks: number[]; index: number; colors: number[][] }> = ({ breaks, index, colors }) => {
  let text = ""
  if (index === 0) {
    text = `<${breaks[0]}`
  } else if (index === breaks.length) {
    text = `>${breaks[breaks.length - 1]}`
  } else {
    text = `${breaks[index - 1]}-${breaks[index]}`
  }
  return (
    <div className="ColorRow">
      {/* @ts-ignore */}
      <span style={{ background: `rgb(${colors[index].join(",")})` }}></span>
      <p>{text}</p>
    </div>
  )
}

const Tooltip: React.FC<{ dataService: DataService }> = ({ dataService }) => {
  const tooltip = useAppSelector((state) => state.map.tooltip)
  if (!tooltip) {
    return null
  }
  const { x, y, id } = tooltip
  const datasets = Object.keys(dataService.data)
  const data = datasets.map((d) => dataService.data[d]?.[id]).filter(Boolean)

  return (
    <div style={{ background: "white", position: "fixed", left: x, top: y, padding:'1rem', zIndex:1001 }}>
      {data.map((d) =>
        Object.entries(d!).map(([k, v]) => {
          return (
            <p>
              {k}: {v}
            </p>
          )
        })
      )}
    </div>
  )
}

export default function MapOuter() {
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  )
}

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
}

const years = Array.from({ length: 25 }, (_, i) => 1997 + i)
export const Map = () => {
  const { isReady, data, colorFunc, colors, ds, breaks, currentColumnSpec, currentDataSpec } = useDataService()
  const getElementColor = (element: GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties>) => {
    if (!isReady) {
      return [0, 0, 0, 120]
    }
    const id = element?.properties?.GEOID
    const d = data?.[+id]
    if (id === undefined || d === undefined) {
      return [0, 0, 0, 120]
    }
    // @ts-ignore
    return colorFunc(d)
  }
  const layers = [
    new MVTLayer({
      data: `/api/tiles/tracts/{z}/{x}/{y}`,
      minZoom: 0,
      maxZoom: 14,
      getLineColor: [192, 192, 192, 50],
      getFillColor: getElementColor,
      updateTriggers: {
        getFillColor: [isReady, currentColumnSpec?.column],
      },
      onHover: (info: any) => {
        if (info?.x !== -1 && info?.y !== -1) {
          dispatch(setTooltipInfo({ x: info.x, y: info.y, id: info.object?.properties?.GEOID }))
        } else {
          // dispatch(setTooltipInfo(null))
        }
      },
      lineWidthMinPixels: 1,
      filled: true,
      stroked: true,
      beforeId: "water",
      pickable: true,
    }),
  ]
  const mapRef = useRef(null)
  const year = useAppSelector((state) => state.map.year)
  const dispatch = useAppDispatch()
  const handleYearChange = (year: number) => {
    dispatch(setYear(year))
  }
  const handleSetColumn = (col: string | number) => {
    dispatch(setCurrentColumn(col))
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", top: 0, left: 0 }}>
      <div style={{ position: "absolute", bottom: "2rem", right: "1rem", zIndex: 1000 }}>
        <div className="ColorLegend">
          <h3>{currentColumnSpec?.name}</h3>
          {!!(colors.length && breaks.length) &&
            colors.map((_, i) => <BreakText colors={colors} breaks={breaks} index={i} />)}
          <p style={{ maxWidth: "35ch", fontSize: "0.75rem" }}>
            <i>
              Data source InfoGroup Refernce USA. Concentration index (HHI) includes grocery, superstore, and dollar
              stores.
            </i>
          </p>
        </div>
      </div>
      <div style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 999 }}>
        <DropdownMenuDemo>
          <>
            <SelectMenu
              title="Choose a column"
              value={currentColumnSpec?.name || "Choose a column"}
              onValueChange={handleSetColumn}
            >
              <>
                {currentDataSpec?.columns.map((c) => (
                  <Select.Item className="SelectItem" value={c.column as string}>
                    <Select.ItemText>{c.name}</Select.ItemText>
                    <Select.ItemIndicator className="SelectItemIndicator">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </>
            </SelectMenu>
          </>
        </DropdownMenuDemo>
      </div>
      <Tooltip dataService={ds} />
      <GlMap
        hash={true}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/dhalpern/clsb432ya02pi01pf1o813uwa"
        initialViewState={INITIAL_VIEW_STATE}
        // @ts-ignore
        ref={mapRef}
        reuseMaps={true}
      >
        <NavigationControl />
        <DeckGLOverlay layers={layers} interleaved={true} />
      </GlMap>
    </div>
  )
}
function DeckGLOverlay(
  props: MapboxOverlayProps & {
    interleaved?: boolean
  }
) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props))
  overlay.setProps(props)
  return null
}
