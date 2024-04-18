import { SubNavList } from "./SubNavList"
import { NavProps } from "./types"

export const NavRenderer: React.FC<NavProps> = ({ navInfo }) => {
  const links = navInfo.data.nav.links
  // horizontal sticky div
  // right aligned list of items
  // render subLinks as dropdown
  return (
    <div className="sticky top-0 z-50 mt-0 bg-white/85 p-4 text-neutral-950 shadow-md">
      <div className="flex items-center justify-between">
        <span className="font-display prose m-0 p-0">
          <a href="/" className="m-0 p-0 line-height-0 no-underline">
            <h1 className="m-0 p-0">{navInfo.data.nav.title}</h1>
          </a>
        </span>
        <ul className="flex justify-end">
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
    </div>
  )
}
