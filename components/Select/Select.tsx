import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import * as Select from "@radix-ui/react-select"
import React from "react"

type SelectProps = {
  title: string
  value: string
  children: React.ReactNode
  onValueChange: (e: any) => void
}
export const SelectMenu: React.FC<SelectProps> = ({ title, value, children, onValueChange }) => (
  <Select.Root onValueChange={onValueChange}>
    <Select.Trigger
      className="z-0 
      mb-[-1px] mr-[-1px] inline-flex h-[35px]
      max-w-full items-center justify-center gap-[5px] border-[1px] border-solid border-neutral-300 bg-white p-1
      px-[15px] text-sm leading-none text-neutral-700
      shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-mauve3 focus:border-b-4 focus:shadow-[0_0_-5px_5px] focus:shadow-blackA5 focus:outline-none  data-[placeholder]:text-violet9"
      aria-label="Food"
    >
      <Select.Value placeholder={value || title} />
      <Select.Icon className="size-4">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        className="
      overflow-hidden rounded-md border-2 border-neutral-300 bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]
      "
      >
        <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-violet11">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-[5px]">{children}</Select.Viewport>
        <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-violet11">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
)
