"use client"
import * as Tabs from "@radix-ui/react-tabs"
import React from "react"

const TabsComponent: React.FC<{ children: any[] }> = ({ children }) => {
  return (
    <Tabs.Root defaultValue={children[0].props["data-tab-id"]} className="flex flex-col">
      <Tabs.List className="flex shrink-0 border-b border-mauve6" aria-label="Choose a tab">
        {React.Children.map(children, (child, index) => (
          <Tabs.Trigger
            key={index}
            value={child.props["data-tab-id"]}
            className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
          >
            {child.props["data-tab-id"]}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {React.Children.map(children, (child, index) => (
        <Tabs.Content key={index} value={child.props["data-tab-id"]}>
          {child}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export default TabsComponent
