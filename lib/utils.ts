import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CATEGORY_ICONS, CATEGORY_GRADIENTS, DEFAULT_IMAGES } from './constants'
import type { Category, Product, ProductWithDetails } from './types'

// ===========================================
// 样式相关工具函数
// ===========================================

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===========================================
// 格式化工具函数
// ===========================================

/**
 * 格式化价格显示
 */
export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`
}

/**
 * 格式化折扣百分比
 */
export function formatDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) return '刚刚'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`
  return `${Math.floor(diffInSeconds / 31536000)}年前`
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ===========================================
// 验证工具函数
// ===========================================

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证密码强度
 */
export function validatePassword(password: string): {
  isValid: boolean
  message: string
} {
  if (password.length < 6) {
    return { isValid: false, message: '密码长度至少6位' }
  }
  if (password.length > 50) {
    return { isValid: false, message: '密码长度不能超过50位' }
  }
  if (!/(?=.*[a-zA-Z])/.test(password)) {
    return { isValid: false, message: '密码必须包含字母' }
  }
  return { isValid: true, message: '密码格式正确' }
}

// ===========================================
// 数据转换工具函数
// ===========================================

/**
 * 转换分类数据格式
 */
export function transformCategories(categories: any[]): Category[] {
  return (categories || []).slice(0, 4).map(category => ({
    id: category.id.toString(),
    name: category.name,
    description: category.description || `精选${category.name}系列`,
    imageUrl: category.image || DEFAULT_IMAGES.CATEGORY,
    icon: CATEGORY_ICONS[category.name] || '🌟',
    gradient: CATEGORY_GRADIENTS[category.name] || 'bg-gradient-to-br from-gray-500/60 to-slate-500/60',
    subcategories: category.subcategories?.slice(0, 4).map((sub: any) => sub.name || sub) || [],
    productCount: category._count?.products || 0,
    isActive: category.isActive ?? true,
  }))
}

/**
 * 转换商品数据格式
 */
export function transformProducts(products: any[]): Product[] {
  return products.map(product => ({
    id: product.id.toString(),
    name: product.name,
    brand: product.brand || '未知品牌',
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    imageUrl: product.images?.[0] || DEFAULT_IMAGES.PRODUCT,
    images: product.images || [DEFAULT_IMAGES.PRODUCT],
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    inStock: product.stock > 0,
    stock: product.stock || 0,
    category: product.category?.name || '未分类',
    subcategory: product.subcategory?.name || '',
    description: product.description || '',
    tags: product.tags || [],
    isNew: product.isNew || false,
    isHot: product.isHot || false,
    isFeatured: product.isFeatured || false,
    isActive: product.isActive ?? true,
    createdAt: product.createdAt ? new Date(product.createdAt) : new Date(),
    updatedAt: product.updatedAt ? new Date(product.updatedAt) : new Date(),
  }))
}

/**
 * 转换商品详情数据格式
 */
export function transformProductDetails(product: any): ProductWithDetails {
  const baseProduct = transformProducts([product])[0]
  return {
    ...baseProduct,
    relatedProducts: product.relatedProducts ? transformProducts(product.relatedProducts) : [],
    specifications: product.specifications || {},
    ingredients: product.ingredients || [],
    usage: product.usage || '',
    precautions: product.precautions || [],
  }
}

// ===========================================
// URL 和路由工具函数
// ===========================================

/**
 * 构建查询字符串
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

/**
 * 解析查询字符串
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  
  params.forEach((value, key) => {
    result[key] = value
  })
  
  return result
}

/**
 * 生成产品链接
 */
export function generateProductUrl(productId: string): string {
  return `/products/${productId}`
}

/**
 * 生成分类链接
 */
export function generateCategoryUrl(categoryId: string, subcategoryId?: string): string {
  const base = `/categories/${categoryId}`
  return subcategoryId ? `${base}/${subcategoryId}` : base
}

// ===========================================
// 数组和对象工具函数
// ===========================================

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any }
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone((obj as { [key: string]: any })[key])
    })
    return clonedObj as T
  }
  return obj
}

/**
 * 数组去重
 */
export function uniqueArray<T>(array: T[], keyFn?: (item: T) => any): T[] {
  if (!keyFn) return [...new Set(array)]
  
  const seen = new Set()
  return array.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * 安全的数组分组
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    groups[key] = groups[key] || []
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// ===========================================
// 性能优化工具函数
// ===========================================

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// ===========================================
// 错误处理工具函数
// ===========================================

/**
 * 安全的 JSON 解析
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * 异步错误处理包装器
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T> | null> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error('异步操作失败:', error)
      return null
    }
  }
}
