import Image from "next/image"
import { HomeProps } from "./types"

export const Renderer: React.FC<HomeProps> = () => {
  // const sections = pageInfo.data.page.sections || []
  return (
    <main className="flex flex-col">
      <div className="text-theme-canvas-100 relative h-[100vh] w-full" id="main-hero">
        <div className="">
          <Image
            src="/images/hero.png"
            alt="Picture of the author"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "top middle",
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-theme-navy-500 to-theme-navy-500"></div>
        <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-theme-navy-500"></div>
        <div className="text-theme-canvas-500 flex h-full flex-col justify-end p-4">
          <div className="z-20 grid grid-flow-col grid-rows-2">
            <div>
              <h1 className="text-9xl font-bold" style={{WebkitTextStroke: "2px #00152c"}}>Feeding <span className="text-theme-navy-500 block" style={{WebkitTextStroke: "2px white"}}>Fairness</span></h1>
            </div>
            <div>
              <h2 className="text-3xl font-bold">
                Understanding the impacts of structural racism &amp; unfair markets on food access
              </h2>
            </div>
          </div>
          <div className="z-20 grid grid-flow-col grid-rows-2">
            <div>
              This tool enables advocates, analytics, and decision-makers to unravel the landscape of inequitable access
              to food across the US. Use this tool to find opportunities to improve access, break down potential
              relationships of factors driving inequity, and utilize our data for further analysis and research.
            </div>
            <div>
              Know where you want to see? Search for a state, county, or address below to see a report on food access,
              market concentration, and structural racism:
            </div>
          </div>
        </div>
      </div>
      <div className="text-theme-canvas-500 border-top-1 h-[50vh] bg-[#00152c] p-4">
        <hr />
        {/* 4 div flex layout equal widths */}
        {/* reports, trends, toolkit, about */}
        <div className="my-4 flex flex-row justify-between gap-4">
          <div className="flex flex-col border-2 p-4">
            <h1>Reports</h1>
            <p>Find reports on food access, market concentration, and structural racism.</p>
            <p>
              <i>coming soon...</i>
            </p>
          </div>
          <div className="flex flex-col border-2 p-4">
            <h1>Trends</h1>
            <p>Explore trends in food access, market concentration, and structural racism.</p>
            <p>
              <i>coming soon...</i>
            </p>
          </div>
          <div className="flex flex-col border-2 p-4">
            <h1>Toolkit</h1>
            <p>Use our toolkit to analyze and visualize data on food access.</p>
            <p>
              <i>coming soon...</i>
            </p>
          </div>
          <div className="flex flex-col border-2 p-4">
            <h1>About</h1>
            <p>Learn more about the project and our team.</p>
            <p>
              <i>coming soon...</i>
            </p>
          </div>
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
