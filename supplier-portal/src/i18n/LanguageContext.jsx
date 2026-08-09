import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { en, si, ta } from './translations'

const LanguageContext = createContext(null)

const dicts = { en, si, ta }

function get(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('vendiora-lang') || 'en'
    } catch {
      return 'en'
    }
  })

  const setLang = useCallback((code) => {
    setLangState(code)
    try {
      localStorage.setItem('vendiora-lang', code)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (path) => get(dicts[lang], path) ?? get(en, path) ?? path,
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export default LanguageProvider
