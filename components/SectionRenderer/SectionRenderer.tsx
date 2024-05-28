import { TinaMarkdown } from "tinacms/dist/rich-text"
import { PageProps } from "../Pages/types"

export const SectionRenderer: React.FC<PageProps> = ({
  pageInfo
}) => {
  const sections = pageInfo.data.page.sections || []

  return (
    <main className="flex flex-col">
      <article className="prose p-4 max-w-4xl">
        <TinaMarkdown content={pageInfo.data.page.body} />
        {sections.map((section: any, i: number) => (
          <div key={i}>
            <h3>{section.title}</h3>
            <TinaMarkdown content={section.body} />
          </div>
        ))}
      </article>
    </main>
  )
}
