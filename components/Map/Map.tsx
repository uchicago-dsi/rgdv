"use client"
import { store, useAppDispatch, useAppSelector } from "utils/state/store"
import { setCurrentColumn, setCurrentData, setCurrentFilter, setTooltipInfo, setYear } from "utils/state/map"
import { Provider, useSelector } from "react-redux"
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed"
import GlMap, { NavigationControl, useControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import React, { useMemo, useRef } from "react"
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
import { Button } from "components/Button/Button"
import CountyFilterSelector from "components/CountyFilterSelector"

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
  const { x, y, id } = tooltip || {}

  const data = useMemo(() => {
    if (!id) {
      return []
    }
    const output = config.map((d) => {
      const dataOutput = {
        "header": d.name
      } as any
      const data = dataService.data[d.filename]?.[id]
      if (data) {
        d.columns.forEach((c) => {
          dataOutput[c.name] = data[c.column]
        })
      }
      return dataOutput
    })
    return output
  },[id])
  
  if (!x || !y || !id) {
    return null
  }
  
  return (
    <div
    className="shadow-md bg-white bg-opacity-90 border border-gray-200 rounded-md p-2 fixed pointer-events-none padding-4 z-[1001]"
      style={{
        left: x + 10,
        top: y + 10,
      }}
    >
      {data.map((d) => {
        const keys = Object.keys(d).filter(k => k !== 'header')
        // nice skeumorphic shadow
        return <p className="pb-2">
          <b>{d.header}</b>
          <ul>
            {keys.map(k => <li>{k}: {d[k]}</li>)}
          </ul>
        </p>
      })}
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
  const { isReady, data, colorFunc, colors, ds, breaks, currentColumnSpec, currentDataSpec, currentFilter } =
    useDataService()
  const getElementColor = (element: GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties>) => {
    if (!isReady) {
      return [120, 120, 120, 120]
    }
    const id = element?.properties?.GEOID
    const d = data?.[id]
    if (id === undefined || d === undefined) {
      return [120, 120, 120, 120]
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
        getFillColor: [isReady, currentColumnSpec?.column, currentDataSpec?.filename, colorFunc],
      },
      onHover: (info: any) => {
        if (info?.x && info?.y && info?.object) {
          dispatch(setTooltipInfo({ x: info.x, y: info.y, id: info.object?.properties?.GEOID }))
        } else {
          dispatch(setTooltipInfo(null))
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

  // ACTIONS
  const dispatch = useAppDispatch()
  const handleYearChange = (year: number) => dispatch(setYear(year))
  const handleSetColumn = (col: string | number) => dispatch(setCurrentColumn(col))
  const handleChangeData = (data: string) => dispatch(setCurrentData(data))
  const handleSetFilter = (filter: string) => dispatch(setCurrentFilter(filter))

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", top: 0, left: 0 }}>
      <div style={{ position: "absolute", bottom: "2rem", right: "1rem", zIndex: 1000 }}>
        <div className="ColorLegend">
          <h3>{currentColumnSpec?.name}</h3>
          {!!(colors.length && breaks.length) &&
            colors.map((_, i) => <BreakText key={i} colors={colors} breaks={breaks} index={i} />)}
          <p style={{ maxWidth: "35ch", fontSize: "0.75rem" }}>
            <i>Data source: InfoGroup Reference USA. Concentration index (HHI) includes grocery and superstores only.</i>
          </p>
        </div>
      </div>
      <div className="absolute top-4 left-4 z-50">
        <DropdownMenuDemo>
          <div className="p-4">
            <p>Choose Data</p>
            <hr />
            {config.map((c, i) => (
              <Button
                key={i}
                onClick={() => handleChangeData(c.filename)}
                size="sm"
                className="mr-2"
                intent={c.filename == currentDataSpec?.filename ? "primary" : "secondary"}
              >
                {c.name}
              </Button>
            ))}

            <hr className="my-2"/>
            <h3>Year</h3>

            {currentDataSpec?.columns.map((c, i) => (
              <Button
                key={i}
                onClick={() => handleSetColumn(c.column)}
                size="sm"
                className="mr-2"
                intent={c.column == currentColumnSpec?.column ? "primary" : "secondary"}
              >
                {c.name}
              </Button>
            ))}
            {/* text input */}
            <hr className="my-2"/>
            <h3>Filter</h3>
            <CountyFilterSelector 
              handleSetFilter={handleSetFilter}
              currentFilter={currentFilter}
            />
          </div>
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
