import React from "react"
import { TinaMarkdown, type TinaMarkdownContent } from "tinacms/dist/rich-text"
import Tooltip from "components/Tooltip"
import { getThresholdValue } from "utils/data/formatDataTemplate"
import { StatListProps } from "./types"


export const StatList: React.FC<StatListProps> = ({ stats, data }) => {
  return (
    <ul className="list-disc">
      {stats.map(
        (
          stat: { column: keyof typeof data; templates: any[]; title: string; tooltip: TinaMarkdownContent },
          i: number
        ) => {
          const value = data[stat.column]
          if (value === undefined) {
            return null
          }
          const parsed = getThresholdValue(value, data, stat)
          if (!parsed) {
            return null
          }
          return (
            <li className="mb-4 ml-4" key={i}>
              <p>
                <b>
                  {stat.title}
                  <Tooltip explainer={<TinaMarkdown content={stat.tooltip} />} side="right" size="sm" withArrow />
                </b>
              </p>
              <div className="inline">
                <TinaMarkdown content={parsed} />
              </div>
            </li>
          )
        }
      )}
    </ul>
  )
}
