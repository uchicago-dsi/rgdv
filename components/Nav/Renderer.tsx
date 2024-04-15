import { SubNavList } from "./SubNavList"
import { NavProps } from "./types"

export const NavRenderer: React.FC<NavProps> = ({ navInfo }) => {
  const links = navInfo.data.nav.links
  // horizontal sticky div
  // right aligned list of items
  // render subLinks as dropdown
  return (
    <div className="sticky top-0 p-4 bg-white/85 text-neutral-950 z-50 mt-0 shadow-md">
      <div className="flex justify-between items-center">
        <span className="prose">
          <h1>{navInfo.data.nav.title}</h1>
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
