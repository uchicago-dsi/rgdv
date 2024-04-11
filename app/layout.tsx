import Nav from "components/Nav"
import "styles/tailwind.css"
import { getContentDirs } from "utils/contentDirs"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  getContentDirs()
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
