import ClientRenderer from "./client"
import { SectionRenderer } from "./SectionRenderer";

export default process.env.NODE_ENV === "development" ? ClientRenderer : SectionRenderer;