import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox/typed"
import { useControl } from "react-map-gl"

export function DeckGLOverlay(
  props: MapboxOverlayProps & {
    interleaved?: boolean
  }
) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props))
  overlay.setProps(props)
  return null
}
