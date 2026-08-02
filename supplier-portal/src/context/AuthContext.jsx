import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, getToken, setToken, getUser, setUser } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(getUser())
  const [application, setApplication] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(!!getToken())

  useEffect(() => {
    if (!getToken()) return
    api
      .me()
      .then((data) => {
        setUserState(data.user)
        setUser(data.user)
        setApplication(data.application)
        setCompany(data.company)
      })
      .catch(() => {
        setToken(null)
        setUser(null)
        setUserState(null)
        setApplication(null)
        setCompany(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    setToken(data.token)
    setUserState(data.user)
    setUser(data.user)
    setApplication(data.application)
    setCompany(data.company)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const data = await api.register(payload)
    setToken(data.token)
    setUserState(data.user)
    setUser(data.user)
    setApplication(data.application)
    setCompany(data.company)
    return data
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setUserState(null)
    setApplication(null)
    setCompany(null)
  }, [])

  const refresh = useCallback(async () => {
    const data = await api.me()
    setUserState(data.user)
    setUser(data.user)
    setApplication(data.application)
    setCompany(data.company)
    return data
  }, [])

  return (
    <AuthContext.Provider value={{ user, application, company, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
