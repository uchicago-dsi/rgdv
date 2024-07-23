import Image from "next/image"
import { TinaMarkdown } from "tinacms/dist/rich-text"
import PostWidget from "components/PostWidgets"
import { getMdxContent } from "hooks/useMdxContent"

type Post = {
  data: {
    post: {
      title: string
      author: string
      date: string
      shortText: string
      mainImage: string
      body: any
    }
  }
}

export default async function Page({ params }: { params: any }) {
  const content = (await getMdxContent<Post>("post", params.post + ".mdx")) as unknown as Post
  const { author, title, body, mainImage, date } = content?.data?.post || ({} as any)
  const cleanDate = date && new Date(date).toLocaleDateString()
  if (content instanceof Error)
    return (
      <div className="prose m-auto my-12">
        <h1>Unable to find post</h1>
        <a href="/posts">Back to list of posts</a>
        <br />
        <a href="/">Home</a>
      </div>
    )
  return (
    <div className="prose m-auto my-12">
      <h1>{title}</h1>
      {author && (
        <p>
          <i>
            By: {author} {date && <> on {cleanDate}</>}
          </i>
        </p>
      )}
      <Image src={mainImage} alt={title} width={800} height={400} />
      {/* @ts-ignore */}
      <TinaMarkdown components={{ PostWidget }} content={body} />
    </div>
  )
}
