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

export default async function Page({ params }: { params: any }) {
  const content = (await getMdxContent<PostData>("post", params.post + ".mdx")) as unknown as PostData
  return <Post content={content} />
}
