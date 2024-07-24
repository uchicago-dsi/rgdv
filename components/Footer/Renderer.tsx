import React from "react"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import { FooterProps } from "./types"

export const FooterRenderer: React.FC<FooterProps> = ({ nav, content }) => {
  const column1 = content.data.page.sections.find((section: any) => section.title === "column1")
  const column2 = content.data.page.sections.find((section: any) => section.title === "column2")
  return (
    <footer className="prose -mb-5 max-w-none bg-theme-navy-500 text-white">
      {/* three columns 40 / 40 / 20 */}
      {/* one col on mobile */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-6">
        <div className="col-span-1 md:col-span-2">
          <h1 className="text-white">Grocery Gap Atlas</h1>
          <TinaMarkdown content={content.data.page.body} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <TinaMarkdown content={column1.body} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <TinaMarkdown content={column2.body} />
        </div>
      </div>
      <div className="bg-white/25">
        {/* horizontal ul of nav.data.links */}
        <ul className="flex list-none space-x-4 py-2 pl-4 text-white ">
          {nav.data.nav.links.map((link: any) => (
            <li key={link.title}>
              <a href={link.path} className="text-white">
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
