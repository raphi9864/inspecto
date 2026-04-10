import { createContext, useContext, useEffect, useState, useCallback } from 'react'

/* ─────────────────────────────────────────────────────────────────
   ProductMode — Inspecto ⇄ SAE toggle
   Persists to localStorage, applies data-product-mode to <html>
   so CSS can react without prop drilling.
   ───────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'inspecto-product-mode'
const MODES = /** @type {const} */ (['inspecto', 'sae'])

const ProductModeContext = createContext({
  mode: 'inspecto',
  setMode: () => {},
  toggleMode: () => {},
})

function readInitial() {
  if (typeof localStorage === 'undefined') return 'inspecto'
  const saved = localStorage.getItem(STORAGE_KEY)
  return MODES.includes(saved) ? saved : 'inspecto'
}

export function ProductModeProvider({ children }) {
  const [mode, setModeState] = useState(readInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-product-mode', mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const setMode = useCallback((next) => {
    if (!MODES.includes(next)) return
    setModeState(next)
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((m) => (m === 'inspecto' ? 'sae' : 'inspecto'))
  }, [])

  return (
    <ProductModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ProductModeContext.Provider>
  )
}

export function useProductMode() {
  return useContext(ProductModeContext)
}
