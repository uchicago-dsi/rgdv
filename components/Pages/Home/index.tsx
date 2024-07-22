import ClientRenderer from "./Client"
import { Renderer } from "./Renderer"
export default process.env.NODE_ENV === "development" ? ClientRenderer : Renderer
