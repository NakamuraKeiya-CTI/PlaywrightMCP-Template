import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  username: string | null
  isLoggedIn: boolean
  login: (username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null)

  const login = (name: string) => setUsername(name)
  const logout = () => setUsername(null)

  return (
    <AuthContext.Provider
      value={{ username, isLoggedIn: username !== null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
