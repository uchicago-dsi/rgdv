import { GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/react"
import { Antonio, Libre_Baskerville, Open_Sans } from "next/font/google"
import "styles/tailwind.css"
import "styles/global.css"

import Footer from "components/Footer"
import Nav from "components/Nav"
import { ReportLoadingShade } from "components/ReportLoadingShade/ReportLoadingShade"

// import { WipTag } from "components/WipTag"

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
      <GoogleTagManager gtmId="GTM-WZWPHCG" />
      <head>
        <script defer src="https://core-facility-umami.vercel.app/script.js" data-website-id="930de253-ea28-4dc2-9e46-aeccbe2f0294"></script>
      </head>
      <body>
        {/* <Transitions> */}
        <Nav />
        <ReportLoadingShade />
        {/* <Animate className="flex-1"> */}
        {children}
        {/* </Animate> */}
        {/* <WipTag /> */}
        {/* </Transitions> */}
        <Footer />
      </body>
      <Analytics />
    </html>
  )
}
