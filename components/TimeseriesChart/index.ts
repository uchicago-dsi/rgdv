import dynamic from "next/dynamic"
const TimeseriesChart = dynamic(() => import("components/TimeseriesChart/Renderer"), { ssr: false })

export default TimeseriesChart
