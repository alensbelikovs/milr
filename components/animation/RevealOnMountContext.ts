import { createContext } from "react"

// True inside the sidebar, where reveals play on mount instead of waiting for a scroll trigger
export const RevealOnMountContext = createContext(false)
