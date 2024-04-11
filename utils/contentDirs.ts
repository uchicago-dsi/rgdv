import path from "path"
export const contentDirs = [
  path.join(process.cwd(), "content", "page"),
  path.join(process.cwd(), "content", "nav"),
  path.join(process.cwd(), "content", "posts")
]
export const getContentDirs = () => {
  return contentDirs
}