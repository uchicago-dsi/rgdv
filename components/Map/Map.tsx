"use client"
import { store, useAppDispatch, useAppSelector } from "utils/state/store"
import { setCurrentColumn, setCurrentData, setCurrentFilter, setTooltipInfo, setYear } from "utils/state/map"
import { Provider, useSelector } from "react-redux"
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed"
import GlMap, { NavigationControl, useControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import React, { useEffect, useMemo, useRef, useState } from "react"
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
  // @ts-ignore
  const data = dataService.tooltipResults[id]
  const [_updateTrigger, setUpdateTrigger] = useState<number>(1)

  useEffect(() => {
    const main = async () => {
      if (!id) {
        return
      }
      const tooltipData = await dataService.getTooltipValues(id)
      setUpdateTrigger((v) => (v+1) % 100)
    }
    main()
  }, [id])

  if (!x || !y) {
    return null
  }

  return (
    <div
      className="padding-4 pointer-events-none fixed z-[1001] rounded-md border border-gray-200 bg-white bg-opacity-90 p-2 shadow-md"
      style={{
        left: x + 10,
        top: y + 10,
      }}
    >
      {/* @ts-ignore */}
      {data ? (
        data.map((d: any, i: number) => {
          const keys = Object.keys(d).filter((k) => k !== "header")
          return (
            <p className="pb-2" key={i}>
              <b>{d.header}</b>
              <ul>
                {keys.map((k, i) => (
                  <li key={i}>
                    {k}: {d[k]}
                  </li>
                ))}
              </ul>
            </p>
          )
        })
      ) : (
        <div className="m-2 flex flex-row justify-center align-middle">
          <svg width="24pt" height="24pt" version="1.1" viewBox="0 0 1200 1200" className="mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg">
            <path d="m750.3 1047.7c79.703-26.676 120.28 94.527 40.562 121.2-72.605 24.395-149.79 34.559-226.24 30.055-330.65-19.531-583.1-303.66-563.57-634.31 19.531-330.65 303.66-583.11 634.31-563.58 330.65 19.531 583.1 303.66 563.57 634.31-1.5625 26.723-5.082 54.793-10.258 81.047-16.137 82.676-141.86 58.156-125.72-24.535 4.2852-21.656 6.9727-41.984 8.2734-64.02 15.355-259.92-183.43-483.74-443.36-499.08-259.92-15.355-483.74 183.43-499.08 443.36-15.355 259.92 183.41 483.74 443.35 499.08 60.641 3.582 120.56-4.1914 178.17-23.535z" />
          </svg>
          <p>
          Loading...

          </p>
        </div>
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
  longitude: -98.6,
  latitude: 39.8283,
  zoom: 4,
  pitch: 0,
  bearing: 0,
}

const years = Array.from({ length: 25 }, (_, i) => 1997 + i)
export const Map = () => {
  const { isReady, data, testfn, colorFunc, colors, ds, breaks, currentColumnSpec, currentDataSpec, currentFilter } =
    useDataService()
  const getElementColor = (element: GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties>) => {
    if (!isReady) {
      return [120, 120, 120, 120]
    }
    const id = element?.properties?.GEOID
    if (id === undefined) {
      return [120, 120, 120, 120]
    }
    // @ts-ignore
    return colorFunc(id)
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
      onClick: (info: any) => {
        console.log(info)
      },
      onHover: (info: any) => {
        const isFiltered = currentFilter && info.object?.properties?.GEOID?.startsWith(currentFilter) === false
        if (info?.x && info?.y && info?.object && !isFiltered) {
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
          {!!(colors?.length && breaks?.length) &&
            colors.map((_, i) => <BreakText key={i} colors={colors} breaks={breaks} index={i} />)}
          <p style={{ maxWidth: "35ch", fontSize: "0.75rem" }}>
            <i>{currentDataSpec?.attribution}</i>
          </p>
        </div>
      </div>
      <div className="absolute left-4 top-4 z-50">
        <DropdownMenuDemo>
          <div className="max-w-[100vw] p-4">
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

            <hr className="my-2" />
            <h3>Year</h3>

            {currentDataSpec?.columns.map((c, i) => (
              <Button
                key={i}
                onClick={() => handleSetColumn(c.column)}
                size="sm"
                className="mr-2"
                intent={c.column == currentColumnSpec?.column ? "primary" : "secondary"}
              >
                {c.column}
              </Button>
            ))}
            {/* text input */}
            <hr className="my-2" />
            <h3>Filter</h3>
            <CountyFilterSelector handleSetFilter={handleSetFilter} currentFilter={currentFilter} />
          </div>
        </DropdownMenuDemo>
      </div>
      <Tooltip dataService={ds} />
      <GlMap
        // hash={true}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/dhalpern/clsb432ya02pi01pf1o813uwa"
        initialViewState={INITIAL_VIEW_STATE}
        // @ts-ignore
        projection={"mercator"}
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
