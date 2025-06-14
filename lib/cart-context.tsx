"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  imageUrl: string
  quantity: number
  inStock: boolean
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoaded: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartItem[] }
  | { type: 'SET_LOADED' }

const STORAGE_KEY = 'shopping_cart'

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoaded: false
}

function calculateCartStats(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { totalItems, totalPrice }
}

function saveToStorage(items: CartItem[]) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  } catch (error) {
    console.error('保存购物车到本地存储失败:', error)
  }
}

function loadFromStorage(): CartItem[] {
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
            typeof item.quantity === 'number' &&
            item.quantity > 0
          )
        }
      }
    }
  } catch (error) {
    console.error('从本地存储加载购物车失败:', error)
  }
  return []
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_FROM_STORAGE': {
      const items = action.payload
      const { totalItems, totalPrice } = calculateCartStats(items)
      return {
        ...state,
        items,
        totalItems,
        totalPrice,
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
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id)
      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }]
      }

      const { totalItems, totalPrice } = calculateCartStats(newItems)
      
      saveToStorage(newItems)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const { totalItems, totalPrice } = calculateCartStats(newItems)

      saveToStorage(newItems)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)

      const { totalItems, totalPrice } = calculateCartStats(newItems)

      saveToStorage(newItems)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice
      }
    }

    case 'CLEAR_CART': {
      saveToStorage([])
      
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (id: string) => number
  isInCart: (id: string) => boolean
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

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

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemQuantity = (id: string): number => {
    const item = state.items.find(item => item.id === id)
    return item ? item.quantity : 0
  }

  const isInCart = (id: string): boolean => {
    return state.items.some(item => item.id === id)
  }

  const getTotalItems = (): number => {
    return state.totalItems
  }

  const getTotalPrice = (): number => {
    return state.totalPrice
  }

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    getTotalItems,
    getTotalPrice
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const cartUtils = {
  formatPrice: (price: number): string => {
    return `¥${price.toFixed(2)}`
  },

  calculateDiscountPercentage: (originalPrice: number, currentPrice: number): number => {
    if (originalPrice <= currentPrice) return 0
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  },

  calculateSavings: (originalPrice: number, currentPrice: number, quantity: number = 1): number => {
    if (originalPrice <= currentPrice) return 0
    return (originalPrice - currentPrice) * quantity
  },

  validateCartItem: (item: any): boolean => {
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