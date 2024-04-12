import Nav from "components/Nav"
import "styles/tailwind.css"
import { Libre_Baskerville, Antonio } from 'next/font/google'
 
const antonio = Antonio({
  variable: '--font-antonio',
  subsets: ['latin'],
})
const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre-baskerville',
  weight: ["400", "700"],
  style: ['normal','italic'],
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${antonio.variable} ${libreBaskerville.variable} fontSans`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
