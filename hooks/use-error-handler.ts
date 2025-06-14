import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { TOAST_CONFIG } from '@/lib/constants'

// ===========================================
// 类型定义
// ===========================================

interface ErrorState {
  message: string | null
  code?: string | number
  details?: any
}

interface UseErrorHandlerReturn {
  error: ErrorState | null
  setError: (error: ErrorState | string | null) => void
  clearError: () => void
  handleError: (error: unknown, context?: string) => void
  handleAsyncError: <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    showToast?: boolean
  ) => Promise<T | null>
}

// ===========================================
// Hook 实现
// ===========================================

/**
 * 统一错误处理 Hook
 * 提供错误状态管理和错误处理工具函数
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const [error, setErrorState] = useState<ErrorState | null>(null)

  /**
   * 设置错误状态
   */
  const setError = useCallback((error: ErrorState | string | null) => {
    if (error === null) {
      setErrorState(null)
      return
    }

    if (typeof error === 'string') {
      setErrorState({ message: error })
    } else {
      setErrorState(error)
    }
  }, [])

  /**
   * 清除错误状态
   */
  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  /**
   * 处理错误的统一函数
   */
  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`错误${context ? `[${context}]` : ''}:`, error)

    let errorMessage = '发生了未知错误'
    let errorCode: string | number | undefined
    let errorDetails: any

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object') {
      const errorObj = error as any
      errorMessage = errorObj.message || errorObj.error || '请求失败'
      errorCode = errorObj.code || errorObj.status
      errorDetails = errorObj
    }

    const errorState: ErrorState = {
      message: errorMessage,
      code: errorCode,
      details: errorDetails
    }

    setErrorState(errorState)

    // 显示错误提示
    toast.error(errorMessage, {
      style: TOAST_CONFIG.STYLES.ERROR,
      duration: TOAST_CONFIG.DURATION
    })
  }, [])

  /**
   * 异步错误处理包装器
   */
  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    showToast: boolean = true
  ): Promise<T | null> => {
    try {
      clearError()
      return await asyncFn()
    } catch (error) {
      console.error(`异步操作失败${context ? `[${context}]` : ''}:`, error)

      let errorMessage = '操作失败'
      let errorCode: string | number | undefined
      let errorDetails: any

      if (error instanceof Error) {
        errorMessage = error.message
        errorDetails = error.stack
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        const errorObj = error as any
        errorMessage = errorObj.message || errorObj.error || '请求失败'
        errorCode = errorObj.code || errorObj.status
        errorDetails = errorObj
      }

      const errorState: ErrorState = {
        message: errorMessage,
        code: errorCode,
        details: errorDetails
      }

      setErrorState(errorState)

      if (showToast) {
        toast.error(errorMessage, {
          style: TOAST_CONFIG.STYLES.ERROR,
          duration: TOAST_CONFIG.DURATION
        })
      }

      return null
    }
  }, [clearError])

  return {
    error,
    setError,
    clearError,
    handleError,
    handleAsyncError
  }
}

// ===========================================
// 错误处理工具函数
// ===========================================

/**
 * API 错误格式化
 */
export function formatApiError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error?.message) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return '网络请求失败，请稍后重试'
}

/**
 * 网络错误判断
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('network') ||
    error?.message?.includes('fetch') ||
    !navigator.onLine
  )
}

/**
 * 权限错误判断
 */
export function isAuthError(error: any): boolean {
  return (
    error?.status === 401 ||
    error?.status === 403 ||
    error?.code === 'UNAUTHORIZED' ||
    error?.code === 'FORBIDDEN'
  )
}

/**
 * 验证错误判断
 */
export function isValidationError(error: any): boolean {
  return (
    error?.status === 400 ||
    error?.status === 422 ||
    error?.code === 'VALIDATION_ERROR'
  )
}

/**
 * 服务器错误判断
 */
export function isServerError(error: any): boolean {
  return (
    error?.status >= 500 ||
    error?.code === 'INTERNAL_SERVER_ERROR'
  )
}

/**
 * 错误重试判断
 */
export function shouldRetry(error: any, attempt: number, maxAttempts: number = 3): boolean {
  if (attempt >= maxAttempts) return false
  
  // 网络错误或服务器错误可以重试
  return isNetworkError(error) || isServerError(error)
}

/**
 * 带重试的异步操作
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (!shouldRetry(error, attempt, maxAttempts)) {
        throw error
      }
      
      // 等待一段时间后重试
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }
  
  throw lastError
} 