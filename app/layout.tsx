import { Antonio, Libre_Baskerville, Open_Sans } from "next/font/google"
import Nav from "components/Nav"
import "styles/tailwind.css"
import { WipTag } from "components/WipTag"
// import Transitions, { Animate } from "components/Transition"
// import DomEvents from "components/Transition/DomEvents"

const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
})
const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const openSans = Open_Sans({
  variable: "--font-open-sans",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${antonio.variable} ${libreBaskerville.variable} ${openSans.variable} fontSans`}>
      <body>
        {/* <Transitions> */}
        <Nav />

        {/* <Animate className="flex-1"> */}
        {children}
        {/* </Animate> */}
        <WipTag />
        {/* </Transitions> */}
      </body>
    </html>
  )
}
