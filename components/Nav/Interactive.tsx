"use client"
import React, { useState } from "react"
import { HiMenu, HiX } from "react-icons/hi"
import { SubNavList } from "./SubNavList"
import { NavProps } from "./types"
import Link from "next/link"

export const InteractiveNav: React.FC<NavProps> = ({ navInfo }) => {
  const links = navInfo.data.nav.links
  // const title = navInfo.data.nav.title
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="flex w-full flex-row justify-between bg-white/85 p-4 text-neutral-950 shadow-md" id="top-nav">
      <div className="prose m-0 p-0 font-display">
        <Link href="/" className="line-height-0 m-0 p-0 no-underline">
          <h1 className="m-0 p-0">{navInfo.data.nav.title}</h1>
        </Link>
      </div>
      <ul className="hidden items-center justify-end md:flex">
        {links.map((link, li) => {
          if (link.sublinks?.length > 0) {
            return (
              <li key={li} className="mr-4">
                <SubNavList title={link.title} subLinks={link.sublinks} />
              </li>
            )
          } else {
            return (
              <li className="mr-4" key={li}>
                <Link href={link.path}>{link.title}</Link>
              </li>
            )
          }
        })}
      </ul>
      <div className="md:hidden">
        <button onClick={toggleMobileMenu} className="focus:outline-none">
          {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center bg-white/95 pl-12 md:hidden">
          <button onClick={toggleMobileMenu} className="absolute right-4 top-4 text-neutral-900 focus:outline-none">
            <HiX size={28} />
          </button>
          <div className="space-y-4 text-left">
            {links.map((link, idx) => (
              <div key={idx}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link href={link.sublinks?.length ? "" : link.path} className="block py-2 text-2xl">
                  {link.title}
                </Link>
                {!!link.sublinks?.length && (
                  <ul className="list-disc pl-6">
                    {link.sublinks.map((sublink, subIdx) => (
                      <li key={`${idx}-${subIdx}`}>
                        <Link href={sublink.path} className="block py-2 text-2xl">
                          {sublink.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
