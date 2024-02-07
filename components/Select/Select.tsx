import React from "react"
import * as Select from "@radix-ui/react-select"
import classnames from "classnames"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import "./styles.css"

type SelectProps = {
  title: string
  value: string
  children: React.ReactNode,
  onValueChange: (e: any) => void
}
export const SelectMenu: React.FC<SelectProps> = ({ title, value, children, onValueChange }) => (
  <Select.Root onValueChange={onValueChange}>
    <Select.Trigger className="SelectTrigger" aria-label="Food">
      <Select.Value placeholder={value || title} />
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="SelectContent">
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">{children}</Select.Viewport>
        <Select.ScrollDownButton className="SelectScrollButton">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
)
