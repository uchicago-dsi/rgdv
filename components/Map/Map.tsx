"use client"
import "mapbox-gl/dist/mapbox-gl.css"
import { MVTLayer } from "@deck.gl/geo-layers/typed"
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers/typed"
import { ThickArrowLeftIcon } from "@radix-ui/react-icons"
import { useParentSize } from "@visx/responsive"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import GlMap, { FullscreenControl, NavigationControl, ScaleControl, useControl } from "react-map-gl"
import { Provider } from "react-redux"
import { MemoryMonitor } from "components/dev/MemoryMonitor"
import Legend from "components/Legend"
import MapTooltip from "components/MapTooltip"
import { deepCompare2d1d } from "utils/data/compareArrayElements"
import { formatterPresets } from "utils/display/formatValue"
import { useDataService } from "utils/hooks/useDataService"
import { setClickInfo, setTooltipInfo } from "utils/state/map"
import { store, useAppDispatch, useAppSelector } from "utils/state/store"
import { fetchCentroidById } from "utils/state/thunks"
import { zeroPopTracts } from "utils/zeroPopTracts"
import { MapSettings } from "components/MapSettings/MapSettings"
import "./styles.css"
import { DeckGLOverlay } from "./DeckGLOverlay"
import { useDebouncedCallback } from 'use-debounce';

export type MapProps = {
  initialFilter?: string
  simpleMap?: boolean
  onClick?: (info: any) => void
  sidebarOpen?: boolean
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


const randomString = () => Math.random().toString(36).substring(7)
// const years = Array.from({ length: 25 }, (_, i) => 1997 + i)
export const Map: React.FC<MapProps> = ({ initialFilter, simpleMap = false, onClick, sidebarOpen = true }) => {
  const _initialFilter = initialFilter && initialFilter.length >= 2 ? initialFilter : undefined
  const mapId = useRef(randomString())
  const router = useRouter()
  const clickedId = useAppSelector((state) => state.map.clicked?.id)
  const [containerHeight, setContainerHeight] = useState<string | undefined>(undefined)

  const [clickedGeo, setClickedGeo] = useState<any>({
    geoid: null,
    geometry: null,
    centroid: null,
  })
  const { parentRef, width, height } = useParentSize({ debounceTime: 150 })

  const handleResize = () => {
    // @ts-ignore
    mapRef.current?.resize()
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
  
  const handleSetTooltipId = useDebouncedCallback(
    // function
    (id) => {
      dispatch(setTooltipInfo({ id }))
    },
    // delay in ms
    50
  );
  // debounce
  const handleHover = (info: any, event: any) => {
    const x = event?.srcEvent?.clientX
    const y = event?.srcEvent?.clientY
    const id = info.object?.properties?.GEOID
    const isZeroPop = zeroPopTracts.indexOf(info.object?.properties?.GEOID) !== -1
    const isFiltered = filter && info.object?.properties?.GEOID?.startsWith(filter) === false
    if (info?.x && info?.y && info?.object && !isFiltered && !isZeroPop) {
      dispatch(setTooltipInfo({ x, y, id: undefined }))
      handleSetTooltipId(id)
    } else {
      dispatch(setTooltipInfo(null))
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window?.addEventListener("resize", handleResize)
    }
    handleResize()
    return () => {
      dispatch(setTooltipInfo(null))
      if (typeof window !== "undefined") {
        window?.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  useEffect(() => {
    handleResize()
  }, [width, height])

  const {
    isReady,
    colorFunction,
    highlightFunction,
    snapshot,
    colors,
    breaks,
    currentColumn,
    currentColumnSpec,
    colorFilter,
    currentColumnGroup,
    currentCentroid,
    filter,
    isBivariate,
    storeData,
    storesHaveGeo,
    highlight,
  } = useDataService(_initialFilter)

  useEffect(() => {
    // pan map to centroid
    if (currentCentroid) {
      // @ts-ignore
      mapRef.current?.jumpTo({
        center: [currentCentroid.x, currentCentroid.y],
        zoom: currentCentroid.z,
        speed: 2,
      })
    }
  }, [currentCentroid])

  const getElementColor = simpleMap
    ? (element: GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties>) => {
        const id = element?.properties?.GEOID
        if (id === undefined || !id.startsWith(_initialFilter)) {
          return [0, 0, 0, 0]
        }
        return [120, 120, 120]
      }
    : (element: GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties>) => {
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
        const color = colorFunction(id)
        if (colorFilter && colorFilter.length) {
          const isInFilter = deepCompare2d1d(colorFilter, color)
          if (!isInFilter) {
            return [color[0], color[1], color[2], 20]
          }
        }
        return color
      }

  const getElementLine = simpleMap
    ? (_e: GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties>) => {
        return [0, 0, 0]
      }
    : (element: GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties>) => {
        if (!highlight) {
          return [0, 0, 0, 0]
        }
        if (!isReady) {
          return [120, 120, 120, 120]
        }
        return highlightFunction(element?.properties?.GEOID)
      }

  const layers = [
    new GeoJsonLayer({
      id: "isochrone-layer",
      // @ts-ignore
      data: JSON.parse(clickedGeo?.geometry || "[]"),
      filled: true,
      stroked: true,
      pickable: false,
      getFillColor: [0, 0, 0, 200],
      getLineColor: [255, 255, 255, 200],
    }),
    new ScatterplotLayer({
      id: "active-centroid-layer",
      data: clickedGeo?.centroid ? [clickedGeo.centroid] : [],
      getRadius: 5,
      radiusUnits: "pixels",
      getPosition: (d: [number, number]) => [d[1], d[0]],
      getFillColor: [0, 0, 255, 255],
      pickable: false,
    }),
    new MVTLayer({
      id: "tracts-layer",
      data: `/api/tiles/tracts/{z}/{x}/{y}`,
      minZoom: 0,
      maxZoom: 14,
      // @ts-ignore
      getLineColor: ({properties}) => {
        const id = properties?.GEOID
        if (id && clickedId && id === clickedId) {
          return [255, 120, 0]
        }
        return [0,0,0,0]
      },
      getFillColor: getElementColor,
      getlineWidth: 1,
      lineWidthMinPixels: 6,
      autoHighlight: true,
      updateTriggers: {
        getLineColor: [clickedId],
        getFillColor: [isReady, snapshot.fill],
      },
      onClick: (info, event) => {
        if (onClick) {
          onClick(info)
        }
        dispatch(setClickInfo({
          id: info.object?.properties?.GEOID,
        }))
        if (event?.srcEvent?.altKey) {
          router.push(`/tract/${info.object?.properties?.GEOID}`)
        } else {
          setClickedGeo({ geoid: info.object?.properties?.GEOID })
        }
      },
      onHover: handleHover,
      filled: true,
      stroked: true,
      beforeId: "water",
      pickable: true,
    }),
    new MVTLayer({
      id: "highlight-layer",
      data: `/api/tiles/tracts/{z}/{x}/{y}`,
      stroked: true,
      filled: false,
      minZoom: 0,
      maxZoom: 14,
      getLineColor: getElementLine,
      getlineWidth: 1,
      lineWidthMinPixels: 2,
      visible: !!highlight,
      updateTriggers: {
        visible: [highlight],
        getLineColor: [isReady, snapshot.highlight, clickedId],
      },
      pickable: false,
    }),

    new ScatterplotLayer({
      id: "stores-locations-layer",
      data: storesHaveGeo ? storeData : [],
      getRadius: 5,
      radiusUnits: "pixels",
      getPosition: (d: any) => [d.STORE_LON, d.STORE_LAT],
      getFillColor: [0, 255, 120],
      onHover: (info: any, event: any) => {
        if (info?.object) {
          const x = event?.srcEvent?.clientX
          const y = event?.srcEvent?.clientY
          const id = info.object?.GEOID
          const data = [
            {
              section: "Store Info",
              columns: [
                {
                  label: "Store",
                  data: info.object?.COMPANY,
                  col: "",
                },
                {
                  label: "Address",
                  data: info.object?.["ADDRESS LINE 1"],
                  col: "",
                },
                {
                  label: "City",
                  data: info.object?.CITY,
                  col: "",
                },
                {
                  label: "State",
                  data: info.object?.STATE,
                  col: "",
                },
                {
                  label: "Zipcode",
                  data: info.object?.ZIPCODE,
                  col: "",
                },
                {
                  label: "Parent Company",
                  data: info.object?.["PARENT COMPANY"],
                  col: "",
                },
                {
                  label: "Percent of area sales",
                  data: formatterPresets.percent(info.object?.["PCT OF TRACT SALES"]),
                  col: "",
                },
              ],
            },
          ]
          dispatch(setTooltipInfo({ x, y, id, data }))
        } else {
          dispatch(setTooltipInfo(null))
        }
      },
      pickable: true,
    }),
  ]
  const mapRef = useRef(null)
  // const year = useAppSelector((state) => state.map.year)

  // ACTIONS
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (_initialFilter) {
      dispatch(fetchCentroidById(_initialFilter))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_initialFilter])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!clickedGeo) {
  //       setClickedGeo({
  //         geoid: null,
  //         geometry: null,
  //         centroid: null,
  //       })
  //     }
  //     const res = await fetch(`/api/isochrone/${clickedGeo.geoid}`)
  //     const data = (await res.json()) as any

  //     setClickedGeo((prev: any) => ({
  //       geoid: prev.geoid,
  //       geometry: data.geometry,
  //       centroid: data.pop_centroid,
  //     }))
  //   }
  //   fetchData()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [clickedGeo.geoid])

  return (
    <div
      className="relative left-0 top-0 h-[100vh] max-h-full w-[100vw] max-w-full"
      id={`${mapId.current}`}
      style={{
        height: containerHeight,
      }}
    >
      <div style={{ position: "absolute", bottom: "2rem", right: "1rem", zIndex: 1000 }}>
        {!simpleMap && (
          <Legend
            column={currentColumnSpec as any}
            colors={colors}
            breaks={breaks as any}
            isBivariate={isBivariate as any}
          />
        )}
      </div>
      <div className="relative flex size-full flex-row border-4">
        {!simpleMap && <MapSettings />}
        <div ref={parentRef} className="relative size-full">
          <GlMap
            // hash={true}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/dhalpern/clsb432ya02pi01pf1o813uwa"
            initialViewState={INITIAL_VIEW_STATE}
            // @ts-ignore
            projection={"mercator"}
            ref={mapRef}
            reuseMaps={true}
          >
            <ScaleControl unit="imperial" />
            <FullscreenControl containerId={mapId.current} />
            <NavigationControl />
            <DeckGLOverlay layers={layers} interleaved={true} />
          </GlMap>
        </div>
      </div>
      <MapTooltip simpleMap={simpleMap} />
      <MemoryMonitor />
    </div>
  )
}