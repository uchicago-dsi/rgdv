import Image from "next/image"
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { PlaceSearch } from "components/StatefulControls/PlaceSearch"
import { HomeProps } from "./types"

const getFirstTextElement = (
  sections: { title: string; body: any }[],
  title: string,
  fallback = "No content found for this section"
) => {
  const section = sections.find((f: any) => f.title === title)
  return section?.body?.children?.[0]?.children?.[0]?.text || fallback
}

const getGridcols = (length: number) => {
  // this needs to be explict for tailwind to work
  switch (length) {
    case 1:
      return "grid-cols-1"
    case 2:
      return "grid-cols-2"
    case 3:
      return "grid-cols-3"
    case 4:
      return "grid-cols-4"
    case 5: 
      return "grid-cols-5"
    case 6:
      return "grid-cols-6"
    default:
      return "grid-cols-4"
  }
}

export const Renderer: React.FC<HomeProps> = ({ pageInfo }) => {
  const sections = pageInfo.data.page.sections || []
  const sectionTitles = sections.map((f: any) => f.title)
  const fourUpSections = sectionTitles.filter((f: string) => f.includes("4UP"))
  const title = getFirstTextElement(sections, "Title")

  return (
    <main className="flex flex-col">
      <div className="relative flex min-h-[80vh] w-full flex-col justify-end text-theme-canvas-100" id="main-hero">
        <Image
          src="/images/hero.png"
          alt="Picture of the author"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "top middle",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-theme-navy-500 to-theme-navy-500"></div>
        <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-theme-navy-500"></div>
        <div className="flex h-full flex-col justify-end p-4 text-theme-canvas-500">
          <div className="z-20 grid grid-flow-col grid-rows-2 lg:mb-12 lg:grid-cols-2 lg:grid-rows-1">
            <div className="invisible md:visible">
              <h1 className="text-[13vw] font-bold leading-[13vw]" style={{ WebkitTextStroke: "2px #00152c" }}>
                {title.split(" ")[0]}
                <span className="block text-theme-navy-500" style={{ WebkitTextStroke: "2px white" }}>
                  {title.split(" ")[1]}
                </span>
              </h1>
            </div>
            <div className="my-12 lg:my-0">
              <h2 className="text-3xl font-bold">{getFirstTextElement(sections, "Subtitle")}</h2>
            </div>
          </div>
          <div className="z-20 grid grid-flow-col grid-rows-2 gap-8 lg:grid-cols-2 lg:grid-rows-1">
            <div>{getFirstTextElement(sections, "Main description")}</div>
            <div>
              {getFirstTextElement(sections, "Search CTA")}
              <PlaceSearch />
            </div>
          </div>
        </div>
      </div>
      <div className="border-top-1 bg-[#00152c] p-4 text-theme-canvas-500 lg:h-[50vh]">
        <hr />
        {/* 4 div flex layout equal widths */}
        {/* reports, trends, toolkit, about */}
        <div className={`my-4 grid justify-between gap-4 md:flex-row ${getGridcols(fourUpSections.length)}`}>
          {fourUpSections.map((title: string, i: number) => (
            <div key={i} className="flex flex-col border-2 p-4">
              <TinaMarkdown content={sections.find((f:any) => f.title === title)?.body} />
            </div>
          ))}
        </div>
      </div>
      {/* <article className="prose p-4">
        <h1>
          <TinaMarkdown content={pageInfo.data.page.body} />
        </h1>
        {sections.map((section: any, i: number) => (
          <div key={i}>
            <h1>{section.title}</h1>
            <TinaMarkdown content={section.body} />
          </div>
        ))}
      </article> */}
    </main>
  )
}
