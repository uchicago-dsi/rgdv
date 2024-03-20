import Map from "components/Pages/Map"

export const metadata = {
  title: "Feeding Fairness Map",
}

const ISCLIENT = typeof window !== "undefined"
export default function Web() {
  return (
    <>
      {ISCLIENT && <Map/>}
    </>
  )
}
