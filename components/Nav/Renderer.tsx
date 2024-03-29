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
          {links.map((link, li) => (
            <li className="mr-4" key={li}>
              <a href={link.path}>{link.title}</a>
              {link.subLinks && (
                <div className="absolute bg-gray-800 p-4 text-white">
                  <ul>
                    {link.subLinks.map((subLink, sli) => {
                      return (
                        <li key={`${li}-${sli}`}>
                          <a href={subLink.path}>{subLink.title}</a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
