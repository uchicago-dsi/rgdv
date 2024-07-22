import { ArrowLeftIcon } from "@radix-ui/react-icons"
import React from "react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import DataLockup from "components/DataLockup"
import { renderReportText } from "utils/data/renderReportText"
import { ReportSections, Sections } from "./Sections"
import { SectionScroll } from "./SectionScroll"

export const ReportRenderer: React.FC<{
  id: string
  _data: any
  statText: any
  unit: string
  comparability?: string
  children?: React.ReactNode
  showHeader?: boolean
}> = ({ _data, statText, id, unit, comparability, children, showHeader }) => {
  const { stats, name, data, foodAccess, marketPower, segregation, economicAdvantage, descriptionText, raceData } =
    renderReportText(_data.result!, statText, id, comparability)

  return (
    <div className="min-h-[100vh] bg-theme-canvas-500 p-4">
      {/* button to add to current url query param comparability = state */}
      {!!showHeader && <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="col-span-1">
          <a href={`/${data.UNIT}`} className="align-center mb-4 flex items-center pb-2 text-sm text-gray-600">
            <ArrowLeftIcon className="mr-2 inline size-4" />
            Back to {data.UNIT_PLURAL}
          </a>
          <div className="prose max-w-none">
            <h2 className="mb-0 text-sm font-light uppercase">{data.UNIT} REPORT</h2>
            <h1 className="mb-0">{name}</h1>
            <div className="text-sm">
              <TinaMarkdown content={descriptionText} />
            </div>
            {children && children}
          </div>
        </div>
        <div className="col-start-2 col-end-6 py-8">
          <div className="relative grid gap-8 lg:grid-cols-4">
            <DataLockup
              title={foodAccess.title}
              tooltip={foodAccess.tooltip}
              value={+foodAccess.value}
              description={foodAccess.text}
              border
            />

            <DataLockup
              title={marketPower.title}
              tooltip={marketPower.tooltip}
              value={+marketPower.value}
              description={marketPower.text}
              border
              inverted
            />
            <DataLockup
              title={economicAdvantage.title}
              tooltip={economicAdvantage.tooltip}
              value={economicAdvantage.value}
              description={economicAdvantage.text}
              border
              inverted
            />
            <DataLockup
              title={segregation.title}
              tooltip={segregation.tooltip}
              value={segregation.value}
              description={segregation.text}
              inverted
            />
          </div>
        </div>
      </div>}
      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        {/* first grid col */}
        <div className="prose sticky top-0 col-span-1 h-min bg-white/50 p-4 shadow-xl">
          <h3>Report Sections</h3>
          <ul className="list-disc pl-6">
            <SectionScroll sections={Sections} />
          </ul>
        </div>
        <div className="col-span-3 mr-4 flex flex-col bg-white/50 p-4 shadow-xl" style={{ gap: "12rem" }}>
          {Sections.map((section) => (
            <ReportSections
              divId={section.id}
              key={section.key}
              component={section.Component}
              id={id}
              data={data}
              stats={stats}
              raceData={raceData}
              unit={unit}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
