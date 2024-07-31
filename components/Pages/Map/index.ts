import IS_DEV from "utils/isDev"
import ClientRenderer from "./Client"
import { Renderer } from "./Renderer"

export default IS_DEV ? ClientRenderer : Renderer
