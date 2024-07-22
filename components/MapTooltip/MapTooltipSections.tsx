import { getColorScale } from "components/PercentileLineChart"
const TooltipDot: React.FC<{ value: number; inverted?: boolean }> = ({ value, inverted }) => {
  const colorScale = getColorScale(inverted)
  const clampedValue = Math.min(100, Math.max(0, value))
  const color = colorScale(clampedValue)
  return <div className="size-4 rounded-full" style={{ backgroundColor: color }}></div>
}

export const LeadSectionsRenderer: React.FC<{ sections: any[] }> = ({ sections }) => {
  return (
    <div className="flex flex-row justify-between gap-2 align-middle">
      {sections.map((section, i) => (
        <div key={i} className="flex w-24 flex-col text-sm">
          <div className="flex flex-row items-center gap-2">
            <p className="text-3xl">{(section.formatter ? section.formatter(section.value) : section.value) || "--"}</p>
            {section.value !== undefined && <TooltipDot value={section.value} inverted={section.inverted} />}
          </div>
          <b className="text-xs">{section.label}</b>
        </div>
      ))}
    </div>
  )
}

export const TooltipSectionsRenderer: React.FC<{ sections: any[]; children?: React.ReactNode }> = ({
  sections,
  children,
}) => {
  const leadSections = sections.filter((section) => section.category === "lead")
  // const nonLeadSections = sections.filter((section) => section.category !== 'lead')
  return (
    <>
      {/* flex lead sections in each row label as small text */}
      <LeadSectionsRenderer sections={leadSections} />
      {/* flex non lead sections in each row */}
      {children}
      <p className="pt-4 text-xs">
        <i>Click for more info in the sidebar</i>
      </p>
    </>
  )
}
