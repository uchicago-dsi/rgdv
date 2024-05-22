import { SectionRenderer } from "./SectionRenderer";
import ClientRenderer from "./client"
export default process.env.NODE_ENV === "development" ? ClientRenderer : SectionRenderer;