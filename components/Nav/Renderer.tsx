import { InteractiveNav } from "./Interactive"
import { SubNavList } from "./SubNavList"
import { NavProps } from "./types"

export const DesktopNavStatic: React.FC<NavProps> = ({ navInfo }) => {
  const links = navInfo.data.nav.links
  // horizontal sticky div
  // right aligned list of items
  // render subLinks as dropdown
  return (
    <div className="bg-white/85 p-4 text-neutral-950 shadow-md " id="top-nav">
      <div className="prose m-0 p-0 font-display">
        <a href="/" className="line-height-0 m-0 p-0 no-underline">
          <h1 className="m-0 p-0">{navInfo.data.nav.title}</h1>
        </a>
      </div>
      <ul className="hidden justify-end md:flex">
        {links.map((link, li) => {
          // @ts-ignore
          if (link.sublinks?.length > 0) {
            return (
              <li key={li} className="mr-4">
                <SubNavList
                  title={link.title}
                  // @ts-ignore
                  subLinks={link.sublinks}
                />
              </li>
            )
          } else {
            return (
              <li className="mr-4" key={li}>
                <a href={link.path}>{link.title}</a>
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}

export const NavRenderer: React.FC<NavProps> = ({ navInfo }) => {
  if (typeof window === "undefined") {
    return <DesktopNavStatic navInfo={navInfo} />
  } else {
    return <InteractiveNav navInfo={navInfo} />
  }
}
