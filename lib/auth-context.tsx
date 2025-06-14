'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { UserPayload } from './auth'
import { checkAuthStatus } from '@/actions/auth'

interface AuthContextType {
  user: UserPayload | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: UserPayload | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const authStatus = await checkAuthStatus()
      setUser(authStatus.user || null)
    } catch (error) {
      console.error('刷新用户信息失败:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 