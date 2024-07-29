import IS_DEV from "utils/isDev"
import ClientRenderer from "./client"
import { SectionRenderer } from "./SectionRenderer"

export default IS_DEV ? ClientRenderer : SectionRenderer
