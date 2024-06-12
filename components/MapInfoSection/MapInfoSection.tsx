import TimeseriesChart from "components/TimeseriesChart"
import React from "react"
import { globals } from "utils/state/globals"
import { setClickInfo } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"

export const MapInfoSection: React.FC = () => {
  const dispatch = useAppDispatch()
  const close = () => dispatch(setClickInfo(null))
  const clicked = useAppSelector((state) => state.map.clicked)
  const data = clicked?.id && globals?.ds?.tooltipResults?.[clicked?.id]
  if (!clicked?.id) {
    return null
  }

  return <div className="relative w-96 border-b-2 border-r-2 border-neutral-500 p-4 py-8">
    <button onClick={close} className="absolute top-0 right-0 p-2">
      &times;
    </button>
    <h3 className="text-2xl pb-4">{clicked.id}</h3>
    <div className="flex flex-row w-full justify-between items-center">
      <p>Open Report:</p>
    <a href={`/tract/${clicked.id}`} className="border-b-2 border-black hover:text-primary-500 hover:border-primary-500 transition-colors">
      Neighborhood
    </a>
    <a href={`/county/${clicked.id.slice(0,5)}`} className="border-b-2 border-black hover:text-primary-500 hover:border-primary-500 transition-colors">
      County
    </a>
    <a href={`/state/${clicked.id.slice(0,2)}`} className="border-b-2 border-black hover:text-primary-500 hover:border-primary-500 transition-colors">
      State
    </a>
    </div>

    {/* <TimeseriesChart id={clicked.id} placeName={clicked.id} /> */}
  </div>
}
