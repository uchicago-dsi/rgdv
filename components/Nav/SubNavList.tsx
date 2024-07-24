"use client"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { LinkSpec } from "./types"

export const SubNavList: React.FC<{ title: string; subLinks: Array<LinkSpec> }> = ({ title, subLinks }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="group flex cursor-pointer items-center outline-none" aria-label="Customise options">
          {title}
          <ChevronDownIcon className="size-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade
            data-[side=top]:animate-slideDownAndFade
          "
          sideOffset={5}
        >
          {subLinks.map((link, li) => {
            return (
              <DropdownMenu.Item
                key={li}
                className="group relative flex h-[2rem] select-none items-center rounded-[3px] px-[5px] leading-none outline-none transition-colors hover:text-primary-500"
              >
                <a href={link.path} className="flex items-center">
                  {link.title}
                </a>
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
