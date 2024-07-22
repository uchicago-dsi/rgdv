import { getMdxContent } from "hooks/useMdxContent"
import Image from "next/image"

type Post = {
  data: {
    post: {
      title: string
      shortText: string
      mainImage: string
      body: any
    }
  }
}

export default async function Page({ params }: { params: any }) {
  const content = (await getMdxContent<Post>("post", params.post + ".md")) as unknown as Post
  return (
    <div className="prose m-auto my-12">
      <h1>{content.data.post.title}</h1>
      <Image src={content.data.post.mainImage} alt={content.data.post.title} width={800} height={400} />

      {JSON.stringify(params)}
    </div>
  )
}
