import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import React from "react"
import "./styles.css"
export interface DropdownProps {
  children: React.ReactNode
}

export const DropdownMenuDemo: React.FC<DropdownProps> = ({ children }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="IconButton" aria-label="Customise options">
          <HamburgerMenuIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default DropdownMenuDemo
