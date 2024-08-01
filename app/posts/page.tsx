import Image from "next/image"
import { getMdxDir } from "hooks/useMdxContent"

export const metadata = {
  title: "Posts :: Grocery Gap Atlas",
}

export default async function AboutPage() {
  const posts = await getMdxDir("post")
  return (
    <div className="prose m-auto my-4 flex flex-col p-12">
      <h1>Articles, Case Studies, and Blog Posts</h1>
      {posts.map((post: any, i: number) => (
        <div className="flex flex-col shadow-xl" key={i}>
          <div className="relative h-96 w-full overflow-hidden">
            <Image
              src={post.mainImage}
              alt={post.title}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }} // optional
            />
          </div>
          <span className="p-4">
            <h3 className="my-1 py-0 text-2xl">{post.title}</h3>
            {post.shortText && <p>{post.shortText}</p>}
            <a
              href={`/posts/${post.slug}`}
              className="float-right my-4 rounded-md bg-theme-canvas-100 p-2 text-right font-bold no-underline shadow-md transition-colors hover:bg-theme-navy-500 hover:text-theme-canvas-100"
            >
              Read More
            </a>
          </span>
        </div>
      ))}
    </div>
  )
}
