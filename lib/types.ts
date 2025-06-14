// ===========================================
// 基础类型定义
// ===========================================

/**
 * 商品基础信息
 */
export interface Product {
    id: string
    name: string
    brand: string
    price: number
    originalPrice?: number
    volume?: string
    rating?: number
    reviewCount?: number
    imageUrl: string
    images?: string[]
    category?: string
    subcategory?: string
    description?: string
    inStock: boolean
    stock: number
    tags?: string[]
    isNew?: boolean
    isHot?: boolean
    isFeatured?: boolean
    isActive?: boolean
    createdAt?: Date
    updatedAt?: Date
}

/**
 * 商品详情页专用类型
 */
export interface ProductWithDetails extends Product {
    relatedProducts?: Product[]
    specifications?: Record<string, string>
    ingredients?: string[]
    usage?: string
    precautions?: string[]
}

/**
 * 分类信息
 */
export interface Category {
    id: string
    name: string
    description: string
    imageUrl: string
    icon?: string
    gradient?: string
    subcategories?: string[]
    productCount?: number
    isActive?: boolean
}

/**
 * 子分类信息
 */
export interface Subcategory {
    id: string
    name: string
    description?: string
    categoryId: string
    productCount?: number
    isActive?: boolean
}

/**
 * 购物车商品项
 */
export interface CartItem {
    id: string
    name: string
    brand: string
    price: number
    originalPrice?: number
    imageUrl: string
    quantity: number
    inStock: boolean
    maxQuantity?: number
}

/**
 * 收藏商品项
 */
export interface FavoriteItem {
    id: string
    name: string
    brand: string
    price: number
    originalPrice?: number
    imageUrl: string
    inStock: boolean
}

/**
 * 用户信息
 */
export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    phone?: string
    role: 'USER' | 'ADMIN'
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

/**
 * 地址信息
 */
export interface Address {
    id: string
    userId: string
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    isDefault: boolean
}

// ===========================================
// UI 组件相关类型
// ===========================================

/**
 * 英雄区域组件属性
 */
export interface HeroSectionProps {
    title: string
    description: string
    imageUrl?: string
    ctaText?: string
    ctaLink?: string
    className?: string
}

/**
 * 特性卡片组件属性
 */
export interface FeatureCardProps {
    icon: React.ReactNode
    title: string
    description: string
    className?: string
}

/**
 * 徽章配置
 */
export interface Badge {
    text: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
}

/**
 * 加载状态
 */
export interface LoadingState {
    isLoading: boolean
    error?: string | null
}

// ===========================================
// API 响应类型
// ===========================================

/**
 * 通用 API 响应
 */
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    error?: string
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

/**
 * 商品查询参数
 */
export interface ProductQueryParams {
    page?: number
    limit?: number
    category?: string
    subcategory?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: 'createdAt' | 'price' | 'name' | 'rating'
    sortOrder?: 'asc' | 'desc'
    search?: string
    isActive?: boolean
    isFeatured?: boolean
    isNew?: boolean
    isHot?: boolean
}

// ===========================================
// 表单相关类型
// ===========================================

/**
 * 登录表单
 */
export interface LoginForm {
    email: string
    password: string
}

/**
 * 注册表单
 */
export interface RegisterForm {
    name: string
    email: string
    password: string
    confirmPassword: string
}

/**
 * 地址表单
 */
export interface AddressForm {
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    isDefault: boolean
}

// ===========================================
// 组件视图模式
// ===========================================

/**
 * 产品展示模式
 */
export type ViewMode = 'grid' | 'list'

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'system'
