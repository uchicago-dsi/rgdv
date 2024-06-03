"use client"

import { useComparability } from "./ComparabilityProvider"
import { ReportRenderer } from "./ReportRenderer"

export const ClientReportRenderer: React.FC<{
  id: string
  _data: any
  statText: any
  unit: string
  children: React.ReactNode
}> = (props) => {
  const { comparability, setComparability, options } = useComparability()
  const isServer = typeof window === "undefined"
  return (
    <>
      <ReportRenderer {...props} comparability={comparability}>
        {/* options on chagne set comparability */}
        <div className="prose">
          <h3>Comparability</h3>
          <p>
            <i>
              You can view data in relation to the whole country, the state of this place, or the county of this place. By default, we compare to the whole country.
            </i>
          </p>
          {options.map((option) => (
            <>
            <label key={option} htmlFor={option}>
              <input type="radio" id={option} name="comparability" value={option} checked={comparability === option} onChange={() => setComparability(option)} />
              {" "}{option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
            <br/>
            </>
          ))}

        </div>
      </ReportRenderer>
      {isServer && props.children}
    </>
  )
}
