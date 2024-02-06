"use client"
import { store, useAppDispatch, useAppSelector } from "utils/state/store"
import { setYear } from "utils/state/map"
import { Provider, useSelector } from "react-redux"
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed"
import GlMap, { NavigationControl, useControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import React, { useRef } from "react"
import { MVTLayer } from "@deck.gl/geo-layers/typed"
import DropdownMenuDemo from "components/Dropdown/Dropdown"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

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
  const layers = [
    new MVTLayer({
      data: `/api/tiles/tracts/{z}/{x}/{y}`,
      minZoom: 0,
      maxZoom: 14,
      getLineColor: [192, 192, 192],
      getFillColor: [140, 170, 180],
      lineWidthMinPixels: 1,
      filled: true,
      stroked: true,
      beforeId: "water",
      pickable: true,
      onClick: (info) => console.log(info),
    }),
  ]
  const mapRef = useRef(null)
  const year = useAppSelector((state) => state.map.year)
  const dispatch = useAppDispatch()
  const handleYearChange = (year: number) => {
    dispatch(setYear(year))
  }
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", top: 0, left: 0 }}>
      <div style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 1000 }}>
        <div style={{ position: "relative", top: 0, left: 0, zIndex: 1000 }}>
          <DropdownMenuDemo>
            <>
              {years.map((buttonYear) => (
                <DropdownMenu.Item
                  className={`DropdownMenuItem ${year === buttonYear ? "selected" : ""}`}
                  key={`${buttonYear}-button`}
                  onClick={() => handleYearChange(buttonYear)}
                >
                  {buttonYear}
                </DropdownMenu.Item>
              ))}
            </>
          </DropdownMenuDemo>
        </div>
      </div>
      <GlMap
        hash={true}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v9"
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
