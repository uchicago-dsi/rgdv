import Nav from "components/Nav"
import path from "path"
import "styles/tailwind.css"

const pagedir = path.join(process.cwd(), "content", "page")
const navdir = path.join(process.cwd(), "content", "nav")
const postsdir = path.join(process.cwd(), "content", "posts")

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
