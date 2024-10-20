import Image from "next/image"
import { TinaMarkdown } from "tinacms/dist/rich-text"
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
const gridColDict = {
  // tailwind needs explicity to make this work
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
}

const getGridcols = (length: number) => {
  return gridColDict[length as keyof typeof gridColDict] || gridColDict[4]
}

export const Renderer: React.FC<HomeProps> = ({ pageInfo }) => {
  const sections = pageInfo.data.page.sections || []
  const sectionTitles = sections.map((f: any) => f?.title)
  const fourUpSections = sectionTitles.filter((f: string) => f?.includes("4UP"))
  const caseStudySections = sectionTitles.filter((f: string) => f?.includes("Case Study"))
  let caseStudies: any[] = new Array(caseStudySections.length / 2).fill(null).map(() => ({}))
  caseStudySections.forEach((section: string) => {
    const sectionData = sections.find((f: any) => f.title === section)
    const caseStudyNumber = section.split("-")[1]?.split("-")[0]?.trim()
    if (!caseStudyNumber) return
    const caseStudyIndex = parseInt(caseStudyNumber) - 1
    if (!caseStudies[caseStudyIndex]) return
    const type = section.split("-").at(-1)?.trim()!
    caseStudies[caseStudyIndex]![type] = sectionData.body
  })

  const title = getFirstTextElement(sections, "Title")

  return (
    <main className="flex flex-col" id="home-content">
      <div className="relative flex min-h-[80vh] w-full flex-col justify-end text-theme-canvas-100" id="main-hero">
        <Image
          src="/images/hero.png"
          alt="Picture of the author"
          fill
          className="size-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-theme-navy-500 to-theme-navy-500"></div>
        <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-theme-navy-500"></div>
        <div className="flex h-full flex-col justify-end p-4 text-theme-canvas-500">
          <div className="z-20 grid-flow-col grid-rows-2 lg:mb-12 lg:grid lg:grid-cols-2 lg:grid-rows-1 lg:items-end">
            <div className="invisible my-12 mt-24 flex justify-center align-middle md:visible lg:block">
              <h1
                className="text-center text-[13vw] font-bold leading-[13vw] lg:text-left"
                style={{ WebkitTextStroke: "2px #00152c" }}
              >
                {title.split(" ").map((f: string, i: number) => (
                  <span
                    key={i}
                    className={`block ${i % 2 === 0 ? "text-theme-navy-500" : ""}`}
                    style={{ WebkitTextStroke: i % 2 === 0 ? "2px white" : "" }}
                  >
                    {f}
                  </span>
                ))}
              </h1>
            </div>
            <div className="my-4 flex h-min flex-col justify-end lg:my-12">
              <h2 className="text-4xl font-bold">{getFirstTextElement(sections, "Subtitle")}</h2>
            </div>
          </div>
          <div className="prose z-20 max-w-none grid-flow-col grid-rows-2 gap-8 text-white lg:grid lg:grid-cols-2 lg:grid-rows-1">
            <div>
              <p>{getFirstTextElement(sections, "Main description")}</p>
            </div>
            <div>
              {getFirstTextElement(sections, "Search CTA")}
              <br />
              <br />
              <PlaceSearch />
            </div>
          </div>
        </div>
      </div>
      <div className="border-top-1 bg-[#00152c] p-4 text-theme-canvas-500">
        <hr />
        {/* 4 div flex layout equal widths */}
        {/* reports, trends, toolkit, about */}
        <div className={`my-4 grid-cols-1 justify-between gap-4 lg:grid ${getGridcols(fourUpSections.length)}`}>
          {fourUpSections.map((title: string, i: number) => (
            <div
              key={i}
              className={`four-up prose mb-4 flex max-w-none flex-col p-4 lg:mb-0 ${i % 2 ? "bg-white/10" : ""}`}
            >
              <TinaMarkdown content={sections.find((f: any) => f.title === title)?.body} />
            </div>
          ))}
        </div>
      </div>
      <article className="prose flex max-w-none flex-col p-4" id="home-case-studies">
        {caseStudies.map((caseStudy: any, i: number) => (
          <div
            key={i}
            className={`align-center prose w-full min-w-full items-center justify-center gap-8 px-4 lg:flex lg:min-h-[50vh] lg:flex-row lg:px-12
                ${i % 2 === 1 ? "bg-theme-canvas-100/25" : ""}
              `}
          >
            <div className={`lg:max-w-[40%]`}>
              <TinaMarkdown content={i % 2 === 0 ? caseStudy.Image : caseStudy.Text} />
            </div>
            <div className={`lg:max-w-[40%]`}>
              <TinaMarkdown content={i % 2 === 0 ? caseStudy.Text : caseStudy.Image} />
            </div>
          </div>
        ))}
      </article>
    </main>
  )
}
