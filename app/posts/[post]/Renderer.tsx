import Image from "next/image"
import React from "react"
import { PostMarkdown } from "components/EnhancedMarkdown"

export const PostRenderer: React.FC<{ content: any }> = ({ content }) => {
  const { author, title, body, mainImage, date } = content?.data?.post || ({} as any)
  const cleanDate = date && new Date(date).toLocaleDateString()
  if (content instanceof Error)
    return (
      <div
        className="prose m-auto my-12 w-full"
        style={{
          maxWidth: "min(100vw - 2rem, 1400px)",
        }}
      >
        <h1>Unable to find post</h1>
        <a href="/posts">Back to list of posts</a>
        <br />
        <a href="/">Home</a>
      </div>
    )
  return (
    <div
      className="prose m-auto my-12"
      style={{
        maxWidth: "min(100vw - 2rem, 1024px)",
      }}
    >
      <h1>{title}</h1>
      {author && (
        <p>
          <i>
            By: {author} {date && <> on {cleanDate}</>}
          </i>
        </p>
      )}
      <Image
        src={mainImage}
        alt={title}
        width={800}
        height={400}
        style={{
          margin: "0 auto",
        }}
      />
      <PostMarkdown content={body} />
    </div>
  )
}
