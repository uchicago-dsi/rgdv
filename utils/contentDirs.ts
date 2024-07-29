import path from "path"
export const contentDirs = [
  path.join(process.cwd(), "public", "content", "page"),
  path.join(process.cwd(), "public", "content", "nav"),
  path.join(process.cwd(), "public", "content", "posts"),
  path.join(process.cwd(), "public", "content", "stats"),
]
export const getContentDirs = () => {
  return contentDirs
}
