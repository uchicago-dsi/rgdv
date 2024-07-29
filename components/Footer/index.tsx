import React from "react"
import { getMdxContent } from "hooks/useMdxContent"
import IS_DEV from "utils/isDev"
import { FooterClient } from "./Client"
import { FooterRenderer } from "./Renderer"
import { FooterProps } from "./types"

const Rendererer = IS_DEV ? FooterClient : FooterRenderer

const Footer: React.FC = async () => {
  const footerNav = await getMdxContent<FooterProps["footerNav"]>("nav", "footer-nav.mdx")
  const footerContent = await getMdxContent<FooterProps["footerContent"]>("page", "footer.mdx")
  // @ts-ignore
  return <Rendererer nav={footerNav} content={footerContent} />
}

export default Footer
