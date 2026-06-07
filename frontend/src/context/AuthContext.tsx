import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { UsuarioResponse } from '../api/types'

interface AuthContextValue {
  user: UsuarioResponse | null
  login: (user: UsuarioResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'urbano_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioResponse | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (u: UsuarioResponse) => {
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
