import TimeseriesChart from "components/TimeseriesChart"
import React, { useEffect, useState } from "react"
import { idColumn } from "utils/data/config"
import { dataTableName } from "utils/data/service/service"
import { globals } from "utils/state/globals"
import { setClickInfo } from "utils/state/map"
import { useAppDispatch, useAppSelector } from "utils/state/store"
const Table: React.FC<{data: Record<string, any>}> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p>No data available</p>;
  }

  const entries = Object.entries(data);

  return (
    <div className="flex justify-center px-0 py-4">
      <table className="min-w-full max-w-4xl divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Property
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map(([key, value], index) => (
            <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-2 max-w-32 overflow-x-auto py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r-2 border-black/50">{key}</td>
              <td className="px-2 max-w-32 overflow-x-auto py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const MapInfoSection: React.FC = () => {
  const dispatch = useAppDispatch()
  const close = () => dispatch(setClickInfo(null))
  const clicked = useAppSelector((state) => state.map.clicked)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const getData = async () => {
      if (clicked?.id && data?.id !== clicked.id) {
        const res = await globals.ds.runQuery(`SELECT * FROM ${dataTableName} WHERE ${idColumn} = ${clicked.id}`)
        setData({
          id: clicked.id,
          data: JSON.parse(globals.ds.stringifyJsonWithBigInts(res[0])),
        })
      }
    }
    getData()
  },[clicked?.id])
  
  if (!clicked?.id) {
    return null
  }

  return <div className="relative w-96 border-b-2 border-r-2 border-neutral-500 p-4 py-8">
    <button onClick={close} className="absolute top-0 right-0 p-2">
      &times;
    </button>
    <h3 className="text-2xl pb-4">{data?.data?.NAME || clicked.id}</h3>
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
    <Table data={data?.data} />

    {/* <TimeseriesChart id={clicked.id} placeName={clicked.id} /> */}
  </div>
}
