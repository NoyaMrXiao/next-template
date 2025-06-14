// ===========================================
// 应用常量配置
// ===========================================

/**
 * 分类图标映射
 */
export const CATEGORY_ICONS: Record<string, string> = {
  '香水类': '🌸',
  '家居香氛类': '🏠',
  '个护香氛类': '🧴',
  '香氛饰品类': '💍',
  '香氛礼盒套装类': '🎁',
  '香味文创类': '📚',
  '耗材与补充品类': '🔄',
  // 可以根据需要添加更多分类
}

/**
 * 分类渐变色映射
 */
export const CATEGORY_GRADIENTS: Record<string, string> = {
  '香水类': 'bg-gradient-to-br from-rose-500/60 to-pink-500/60',
  '家居香氛类': 'bg-gradient-to-br from-blue-500/60 to-indigo-500/60',
  '个护香氛类': 'bg-gradient-to-br from-emerald-500/60 to-teal-500/60',
  '香氛饰品类': 'bg-gradient-to-br from-amber-500/60 to-orange-500/60',
  '香氛礼盒套装类': 'bg-gradient-to-br from-purple-500/60 to-violet-500/60',
  '香味文创类': 'bg-gradient-to-br from-cyan-500/60 to-blue-500/60',
  '耗材与补充品类': 'bg-gradient-to-br from-gray-500/60 to-slate-500/60',
}

/**
 * 默认图片
 */
export const DEFAULT_IMAGES = {
  PRODUCT: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
  CATEGORY: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop',
  HERO: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920&h=1080&fit=crop',
  AVATAR: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
}

/**
 * 分页默认值
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
  MAX_LIMIT: 100,
}

/**
 * 产品相关常量
 */
export const PRODUCT_CONSTANTS = {
  MAX_IMAGES: 5,
  MAX_CART_QUANTITY: 99,
  MIN_PRICE: 0,
  MAX_PRICE: 99999,
  DEFAULT_RATING: 0,
  MAX_RATING: 5,
}

/**
 * 搜索相关常量
 */
export const SEARCH_CONSTANTS = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 20,
}

/**
 * 用户相关常量
 */
export const USER_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MAX_NAME_LENGTH: 50,
  MAX_ADDRESS_LENGTH: 200,
}

/**
 * Toast 通知配置
 */
export const TOAST_CONFIG = {
  DURATION: 3000,
  POSITION: 'top-right' as const,
  STYLES: {
    SUCCESS: {
      background: '#f0fdf4',
      color: '#065f46',
      border: '1px solid #10b981',
    },
    ERROR: {
      background: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #ef4444',
    },
    WARNING: {
      background: '#fffbeb',
      color: '#92400e',
      border: '1px solid #f59e0b',
    },
    INFO: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '1px solid #3b82f6',
    },
  },
}

/**
 * 动画配置
 */
export const ANIMATION_CONFIG = {
  TRANSITION_DURATION: 300,
  STAGGER_DELAY: 100,
  HOVER_SCALE: 1.02,
  PRESS_SCALE: 0.98,
}

/**
 * 布局断点
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
}

/**
 * 应用元数据
 */
export const APP_METADATA = {
  TITLE: '香氛商城 - 探索香氛的奇妙世界',
  DESCRIPTION: '发现独特的香氛体验，让生活充满芬芳',
  KEYWORDS: '香水,香氛,家居香氛,个护,香氛饰品,礼盒套装',
  AUTHOR: '香氛商城',
  LANG: 'zh-CN',
}

/**
 * API 路径
 */
export const API_ROUTES = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  USERS: '/api/users',
  ORDERS: '/api/orders',
  AUTH: '/api/auth',
  SEARCH: '/api/search',
}

/**
 * 页面路径
 */
export const PAGE_ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  CART: '/cart',
  FAVORITES: '/favorites',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
}

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  CART: 'fragrance_cart',
  FAVORITES: 'fragrance_favorites',
  USER: 'fragrance_user',
  THEME: 'fragrance_theme',
  SEARCH_HISTORY: 'fragrance_search_history',
} 