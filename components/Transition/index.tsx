"use client"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import {
  createContext,
  MouseEventHandler,
  PropsWithChildren,
  use,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react"

export const DELAY = 50

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
const noop = () => {}

type TransitionContext = {
  pending: boolean
  navigate: (url: string) => void
}
const Context = createContext<TransitionContext>({
  pending: false,
  navigate: noop,
})
export const usePageTransition = () => use(Context)
export const usePageTransitionHandler = () => {
  const { navigate } = usePageTransition()
  const onClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute("href")
    if (href) navigate(href)
  }

  return onClick
}

type Props = PropsWithChildren<{
  className?: string
}>

export default function Transitions({ children, className }: Props) {
  const [pending, start] = useTransition()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const currLoaded = useRef(pathname)

  useLayoutEffect(() => {
    setIsLoading(false)
  }, [pathname])

  const navigate = (href: string) => {
    start(async () => {
      router.push(href, {

      })
      await sleep(DELAY)
    })
  }

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const a = (e.target as Element).closest("a")
    if (a) {
      e.preventDefault()
      const href = a.getAttribute("href")
      if (href && href !== pathname) {
        setIsLoading(true)
        navigate(href)
      }
    }
  }

  return (
    <Context.Provider value={{ pending, navigate }}>
      {isLoading && <Loader/>}
      <div onClickCapture={onClick} className={className}>
        {children}
      </div>
    </Context.Provider>
  )
}

export function Animate({ children, className }: Props) {
  const { pending } = usePageTransition()
  return (
    <AnimatePresence>
      {!pending && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={className}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-500/25 bg-opacity-75">
      <div className="text-center">
        <div className="text-2xl text-neutral-500">Loading...</div>
        {/* <div className="loader mt-4"></div> */}
      </div>
    </div>
  )
}
