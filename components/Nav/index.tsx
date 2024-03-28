import React from "react";
import { getMdxContent } from "hooks/useMdxContent";
import {NavClient} from "./Client"
import {NavRenderer} from "./Renderer"
import { NavProps } from "./types";

const NavInner = process.env.NODE_ENV === "development" ? NavClient : NavRenderer;

export const Nav: React.FC = async () => {
  const navInfo = await getMdxContent<NavProps['navInfo']>("nav", "main-nav.mdx")
  // @ts-ignore
  return <NavInner navInfo={navInfo} />
}

export default Nav;