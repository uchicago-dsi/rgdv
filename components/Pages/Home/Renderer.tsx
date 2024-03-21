import { HomeProps } from "./types";
import { TinaMarkdown } from 'tinacms/dist/rich-text'

export const Renderer: React.FC<HomeProps> = ({ pageInfo }) => {
  const sections = pageInfo.data.page.sections || []
  
  return (
    <div>
      <h1><TinaMarkdown content={pageInfo.data.page.body}/></h1>
      {sections.map((section: any, i: number) => (
        <div key={i}>
          <h1>{section.title}</h1>
          <TinaMarkdown content={section.body} />
        </div>
      ))}
    </div>
  )
}