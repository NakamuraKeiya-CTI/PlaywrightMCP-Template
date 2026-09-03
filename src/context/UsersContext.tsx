import { createContext, useContext, useState, type ReactNode } from 'react'
import { initialUsers, type User } from '../data/mockUsers'

interface UsersContextValue {
  users: User[]
  getUser: (id: string) => User | undefined
  addUser: (user: Omit<User, 'id'>) => void
  updateUser: (id: string, updates: Omit<User, 'id'>) => void
  deleteUser: (id: string) => void
}

const UsersContext = createContext<UsersContextValue | undefined>(undefined)

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)

  const getUser = (id: string) => users.find((u) => u.id === id)

  const addUser = (user: Omit<User, 'id'>) => {
    const id = String(Date.now())
    setUsers((prev) => [...prev, { id, ...user }])
  }

  const updateUser = (id: string, updates: Omit<User, 'id'>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { id, ...updates } : u)))
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <UsersContext.Provider
      value={{ users, getUser, addUser, updateUser, deleteUser }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers must be used within UsersProvider')
  return ctx
}
