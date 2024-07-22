"use client"
// import { useComparability } from "components/ReportLayout/ComparabilityProvider"
import { DataLockupProps } from "./types"

export const ClientDataLockup: React.FC<DataLockupProps & { children: React.ReactNode }> = ({
  children,
  // ...props
}) => {
  // const { comparability } = useComparability()
  // const isServer = typeof window === "undefined"
  return (
    <div>
      asdf asdf asdf
      {true && children}
    </div>
  )
}
