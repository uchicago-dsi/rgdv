import { Renderer } from "./Renderer";
import ClientRenderer from "./Client"
export default process.env.NODE_ENV === "development" ? ClientRenderer : Renderer;