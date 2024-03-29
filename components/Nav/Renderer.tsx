import { SubNavList } from "./SubNavList"
import { NavProps } from "./types"

export const NavRenderer: React.FC<NavProps> = ({ navInfo }) => {
  const links = navInfo.data.nav.links
  // horizontal sticky div
  // right aligned list of items
  // render subLinks as dropdown
  return (
    <div className="sticky bg-gray-800 p-4 text-white">
      <div className="flex justify-between">
        <h1>{navInfo.data.nav.title}</h1>
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
