import React from "react"
import { getMdxContent } from "hooks/useMdxContent"
import { NavClient } from "./Client"
import { NavProps } from "./types"

export const Nav: React.FC = async () => {
  const navInfo = await getMdxContent<NavProps["navInfo"]>("nav", "main-nav.mdx")
  // @ts-ignore
  return <NavClient navInfo={navInfo} />
}

export default Nav
