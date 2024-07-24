import React from "react"
import { getMdxContent } from "hooks/useMdxContent"
import { FooterClient } from "./Client"
import { FooterRenderer } from "./Renderer"
import { FooterProps } from "./types"

const Rendererer = process.env.NODE_ENV === "development" ? FooterClient : FooterRenderer

const Footer: React.FC = async () => {
  const footerNav = await getMdxContent<FooterProps["footerNav"]>("nav", "footer-nav.mdx")
  const footerContent = await getMdxContent<FooterProps["footerContent"]>("page", "footer.mdx")
  // @ts-ignore
  return <Rendererer nav={footerNav} content={footerContent} />
}

export default Footer
