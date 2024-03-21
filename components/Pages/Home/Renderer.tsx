import { HomeProps } from "./types"
import { TinaMarkdown } from "tinacms/dist/rich-text"

export const Renderer: React.FC<HomeProps> = ({ pageInfo }) => {
  const sections = pageInfo.data.page.sections || []

  return (
    <article className="prose p-4">
      <h1>Pages</h1>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/admin/index.html">Admin</a>
        </li>
      </ul>

      <h1>
        <TinaMarkdown content={pageInfo.data.page.body} />
      </h1>
      {sections.map((section: any, i: number) => (
        <div key={i}>
          <h1>{section.title}</h1>
          <TinaMarkdown content={section.body} />
        </div>
      ))}
    </article>
  )
}
