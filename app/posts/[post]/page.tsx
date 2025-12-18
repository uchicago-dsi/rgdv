import { getMdxContent } from "hooks/useMdxContent"
import { Post } from "./Post"

type PostData = {
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

export default async function Page({ params }: { params: Promise<{ post: string }> }) {
  const { post } = await params
  const content = (await getMdxContent<PostData>("post", post + ".mdx")) as unknown as PostData
  return <Post content={content} />
}
