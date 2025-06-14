"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface FavoriteItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  imageUrl: string
  inStock: boolean
  addedAt: number // 添加时间戳
}

interface FavoritesState {
  items: FavoriteItem[]
  totalItems: number
  isLoaded: boolean
}

type FavoritesAction =
  | { type: 'ADD_ITEM'; payload: Omit<FavoriteItem, 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'LOAD_FROM_STORAGE'; payload: FavoriteItem[] }
  | { type: 'SET_LOADED' }

const STORAGE_KEY = 'favorites'

const initialState: FavoritesState = {
  items: [],
  totalItems: 0,
  isLoaded: false
}

function saveToStorage(items: FavoriteItem[]) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  } catch (error) {
    console.error('保存收藏到本地存储失败:', error)
  }
}

function loadFromStorage(): FavoriteItem[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const items = JSON.parse(stored)
        if (Array.isArray(items)) {
          return items.filter(item => 
            item && 
            typeof item.id === 'string' && 
            typeof item.name === 'string' &&
            typeof item.price === 'number' &&
            typeof item.addedAt === 'number'
          )
        }
      }
    }
  } catch (error) {
    console.error('从本地存储加载收藏失败:', error)
  }
  return []
}

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'LOAD_FROM_STORAGE': {
      const items = action.payload
      return {
        ...state,
        items,
        totalItems: items.length,
        isLoaded: true
      }
    }

    case 'SET_LOADED': {
      return {
        ...state,
        isLoaded: true
      }
    }

    case 'ADD_ITEM': {
      // 检查是否已存在
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id)
      
      if (existingItemIndex >= 0) {
        // 如果已存在，不添加重复项
        return state
      }

      const newItem: FavoriteItem = {
        ...action.payload,
        addedAt: Date.now()
      }

      const newItems = [newItem, ...state.items] // 新添加的在前面

      saveToStorage(newItems)

      return {
        ...state,
        items: newItems,
        totalItems: newItems.length
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)

      saveToStorage(newItems)

      return {
        ...state,
        items: newItems,
        totalItems: newItems.length
      }
    }

    case 'CLEAR_FAVORITES': {
      saveToStorage([])
      
      return {
        ...state,
        items: [],
        totalItems: 0
      }
    }

    default:
      return state
  }
}

interface FavoritesContextType {
  state: FavoritesState
  addItem: (item: Omit<FavoriteItem, 'addedAt'>) => void
  removeItem: (id: string) => void
  clearFavorites: () => void
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState)

  useEffect(() => {
    const storedItems = loadFromStorage()
    if (storedItems.length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedItems })
    } else {
      dispatch({ type: 'SET_LOADED' })
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const items = JSON.parse(e.newValue)
          if (Array.isArray(items)) {
            dispatch({ type: 'LOAD_FROM_STORAGE', payload: items })
          }
        } catch (error) {
          console.error('处理存储变化失败:', error)
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const addItem = (item: Omit<FavoriteItem, 'addedAt'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' })
  }

  const isFavorite = (id: string): boolean => {
    return state.items.some(item => item.id === id)
  }

  const toggleFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (isFavorite(item.id)) {
      removeItem(item.id)
    } else {
      addItem(item)
    }
  }

  const contextValue: FavoritesContextType = {
    state,
    addItem,
    removeItem,
    clearFavorites,
    isFavorite,
    toggleFavorite
  }

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const favoritesUtils = {
  formatPrice: (price: number): string => {
    return `¥${price.toFixed(2)}`
  },

  calculateDiscountPercentage: (originalPrice: number, currentPrice: number): number => {
    if (originalPrice <= currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  },

  validateFavoriteItem: (item: any): boolean => {
    return (
      item &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.brand === 'string' &&
      typeof item.price === 'number' &&
      typeof item.imageUrl === 'string' &&
      typeof item.inStock === 'boolean' &&
      item.price > 0
    )
  }
} 