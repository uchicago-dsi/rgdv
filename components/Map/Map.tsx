"use client"
import "mapbox-gl/dist/mapbox-gl.css"
import { MVTLayer } from "@deck.gl/geo-layers/typed"
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers/typed"
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed"
import "./styles.css"
import { CheckboxIcon } from "@radix-ui/react-icons"
import * as Select from "@radix-ui/react-select"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { ScaleControl } from "react-map-gl"
import GlMap, { NavigationControl, useControl } from "react-map-gl"
import { Provider } from "react-redux"
import CountyFilterSelector from "components/CountyFilterSelector"
import DropdownMenuDemo from "components/Dropdown/Dropdown"
import { SelectMenu } from "components/Select/Select"
import { columnGroups, columnsDict, dataConfig } from "utils/data/config"
import { useDataService } from "utils/hooks/useDataService"
import {
  setCurrentColumn,
  setCurrentColumnGroup,
  setCurrentData,
  setCurrentFilter,
  setTooltipInfo,
} from "utils/state/map"
import { store, useAppDispatch, useAppSelector } from "utils/state/store"
import { zeroPopTracts } from "utils/zeroPopTracts"
import Legend from "components/Legend"
import MapTooltip from "components/MapTooltip"
import { deepCompare2d1d } from "utils/data/compareArrayElements"

export type MapProps = {
  initialFilter?: string
}

const MapOuter: React.FC<MapProps> = (props) => {
  return (
    <Provider store={store}>
      <Map {...props} />
    </Provider>
  )
}
export default MapOuter
// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -98.6,
  latitude: 39.8283,
  zoom: 4,
  pitch: 0,
  bearing: 0,
}

// const years = Array.from({ length: 25 }, (_, i) => 1997 + i)
export const Map: React.FC<MapProps> = ({ initialFilter }) => {
  const router = useRouter()
  const [containerHeight, setContainerHeight] = useState<string | undefined>(undefined)
  const [clickedGeo, setClickedGeo] = useState<any>({
    geoid: null,
    geometry: null,
    centroid: null,
  })
  // on window resize, update the height of the container
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined" || typeof document === "undefined") {
        return
      }
      try {
        const windowHeight = window?.innerHeight
        // find height of #top-nav
        const navHeight = document?.getElementById("top-nav")?.clientHeight || 0
        setContainerHeight(`${windowHeight - navHeight}px`)
      } catch (e) {
        console.error(e)
      }
    }
    if (typeof window !== "undefined") {
      window?.addEventListener("resize", handleResize)
    }
    handleResize()

    return () => {
      if (typeof window !== "undefined") {
        window?.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  const { isReady, colorFunc, colors, ds, breaks, currentColumnSpec, colorFilter, currentColumnGroup, filter, isBivariate } =
    useDataService()
  const availableColumns = columnGroups[currentColumnGroup]?.columns || []
  const getElementColor = (element: GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties>) => {
    if (!isReady) {
      return [120, 120, 120, 120]
    }
    if (zeroPopTracts.indexOf(element?.properties?.GEOID) !== -1) {
      return [0, 0, 0, 0]
    }
    const id = element?.properties?.GEOID
    if (id === undefined) {
      return [120, 120, 120, 120]
    }
    // @ts-ignore
    const color = colorFunc(id)
    if (colorFilter && colorFilter.length) {
      const isInFilter = deepCompare2d1d(colorFilter, color)
      if (!isInFilter) {
        return [color[0], color[1], color[2], 20]
      }
    }
    return color
  }

  const layers = [
    new GeoJsonLayer({
      // @ts-ignore
      data: JSON.parse(clickedGeo?.geometry || "[]"),
      filled: true,
      stroked: true,
      pickable: false,
      getFillColor: [0, 0, 0, 200],
      getLineColor: [255, 255, 255, 200],
    }),
    new ScatterplotLayer({
      id: "scatterplot-layer",
      data: clickedGeo?.centroid ? [clickedGeo.centroid] : [],
      getRadius: 5,
      radiusUnits: "pixels",
      getPosition: (d: [number, number]) => [d[1], d[0]],
      getFillColor: [0, 0, 255, 255],
      pickable: false,
    }),
    new MVTLayer({
      data: `/api/tiles/tracts/{z}/{x}/{y}`,
      minZoom: 0,
      maxZoom: 14,
      getLineColor: [192, 192, 192, 50],
      getFillColor: getElementColor,
      autoHighlight: true,
      updateTriggers: {
        getFillColor: [isReady, currentColumnSpec.name, colorFunc, colorFilter],
      },
      onClick: (info, event) => {
        if (event?.srcEvent?.altKey) {
          router.push(`/tract/${info.object?.properties?.GEOID}`)
        } else {
          setClickedGeo({ geoid: info.object?.properties?.GEOID })
        }
      },
      onHover: (info: any) => {
        const isZeroPop = zeroPopTracts.indexOf(info.object?.properties?.GEOID) !== -1
        const isFiltered = filter && info.object?.properties?.GEOID?.startsWith(filter) === false
        if (info?.x && info?.y && info?.object && !isFiltered && !isZeroPop) {
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
  // const year = useAppSelector((state) => state.map.year)

  // ACTIONS
  const dispatch = useAppDispatch()
  const handleSetColumn = (col: string | number) => dispatch(setCurrentColumn(col))
  const handleSetColumnGroup = (group: string) => dispatch(setCurrentColumnGroup(group))
  const handleSetFilter = (filter: string) => dispatch(setCurrentFilter(filter))

  useEffect(() => {
    if (initialFilter) {
      dispatch(setCurrentFilter(initialFilter))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilter])

  useEffect(() => {
    const fetchData = async () => {
      if (!clickedGeo) {
        setClickedGeo({
          geoid: null,
          geometry: null,
          centroid: null,
        })
      }
      const res = await fetch(`/api/stores/${clickedGeo.geoid}`)
      const data = (await res.json()) as any

      setClickedGeo((prev: any) => ({
        geoid: prev.geoid,
        geometry: data.geometry,
        centroid: data.pop_centroid,
      }))
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedGeo.geoid])

  return (
    <div
      className="relative left-0 top-0 h-[100vh] max-h-full w-[100vw] max-w-full"
      style={{
        height: containerHeight,
      }}
    >
      <div style={{ position: "absolute", bottom: "2rem", right: "1rem", zIndex: 1000 }}>
        <Legend
          column={currentColumnSpec}
          colors={colors}
          breaks={breaks as any}
          isBivariate={isBivariate as any}
        />
      </div>
      <div className="absolute left-4 top-4 z-30 max-w-[50vw]">
        <DropdownMenuDemo>
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
            {/* text input */}
            <hr className="my-2" />
            <p>Filter</p>
            <CountyFilterSelector handleSetFilter={handleSetFilter} currentFilter={filter} />
          </div>
        </DropdownMenuDemo>
      </div>
      <MapTooltip dataService={ds} />
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
        <ScaleControl unit="imperial" />
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
