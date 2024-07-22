
import { getColorScale } from "components/PercentileLineChart";
const TooltipDot: React.FC<{value:number, inverted?:boolean}> = ({value, inverted}) => {
  const colorScale = getColorScale(inverted)
  const clampedValue = Math.min(100, Math.max(0, value))
  const color = colorScale(clampedValue)
  return (
    <div className="h-4 w-4 rounded-full" style={{backgroundColor: color}}></div>
  )
}

export const LeadSectionsRenderer: React.FC<{ sections: any[] }> = ({ sections }) => {
  return (
    <div className="flex flex-row justify-between align-middle gap-2">
      {sections.map((section, i) => (
        <div key={i} className="text-sm flex flex-col w-24">
          <div className="flex flex-row items-center gap-2">
            <p className="text-3xl">{(section.formatter ? 
              section.formatter(section.value) : section.value) || '--'}</p>
            {section.value !== undefined && <TooltipDot value={section.value} inverted={section.inverted} />}
          </div>
          <b className="text-xs">{section.label}</b>
        </div>
      ))}
    </div>
  )
}


export const TooltipSectionsRenderer: React.FC<{ sections: any[], children?:React.ReactNode }> = ({ sections, children }) => {
  const leadSections = sections.filter((section) => section.category === 'lead')
  const nonLeadSections = sections.filter((section) => section.category !== 'lead')
  return (
    <>
    {/* flex lead sections in each row label as small text */}
    <LeadSectionsRenderer sections={leadSections} />
      {/* flex non lead sections in each row */}
      {children}
      <p className="text-xs pt-4">
        <i>Click for more info in the sidebar</i>
      </p>
    </>
  )
}