'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 分类页面数据类型
export interface CategoryPageData {
  categories: CategoryWithStats[]
  products: ProductWithDetails[]
}

export interface CategoryWithStats {
  id: number
  name: string
  description: string | null
  image: string | null
  icon: string
  count: number
  subcategories: string[]
}

export interface ProductWithDetails {
  id: string
  name: string
  category: string
  subcategory: string
  brand: string
  price: number
  originalPrice?: number
  imageUrl: string
  rating: number
  reviewCount: number
  inStock: boolean
  stock: number
  isNew: boolean
  isHot: boolean
}

// 获取全部分类页面数据
export async function getCategoriesPageData(params?: {
  category?: string
  subcategory?: string
  limit?: number
}): Promise<{
  success: boolean
  data?: CategoryPageData
  error?: string
}> {
  try {
    const { limit = 100 } = params || {}

    // 并行获取分类和商品数据
    const [categoriesResult, productsResult] = await Promise.all([
      // 获取所有分类及其子分类和商品统计
      prisma.category.findMany({
        include: {
          subcategories: {
            orderBy: { sort: 'asc' }
          },
          _count: {
            select: { 
              products: { where: { isActive: true } }
            }
          }
        },
        orderBy: { sort: 'asc' }
      }),
      // 获取所有活跃商品
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: true,
          subcategory: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })
    ])

    // 转换分类数据
    const transformedCategories = transformCategories(categoriesResult)
    
    // 转换商品数据
    const transformedProducts = transformProducts(productsResult)

    return {
      success: true,
      data: {
        categories: transformedCategories,
        products: transformedProducts
      }
    }

  } catch (error) {
    console.error('获取分类页面数据失败:', error)
    return {
      success: false,
      error: '获取数据失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 根据分类获取商品
export async function getProductsByCategory(params: {
  categoryName?: string
  subcategoryName?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}): Promise<{
  success: boolean
  data?: {
    products: ProductWithDetails[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  error?: string
}> {
  try {
    const {
      categoryName,
      subcategoryName,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    // 构建查询条件
    const where: any = { isActive: true }

    if (categoryName) {
      where.category = { name: categoryName }
    }

    if (subcategoryName) {
      where.subcategory = { name: subcategoryName }
    }

    // 计算分页
    const skip = (page - 1) * limit

    // 获取商品列表和总数
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          subcategory: true
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return {
      success: true,
      data: {
        products: transformProducts(products),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

  } catch (error) {
    console.error('获取分类商品失败:', error)
    return {
      success: false,
      error: '获取商品失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 获取分类统计信息
export async function getCategoryStats(): Promise<{
  success: boolean
  data?: {
    totalCategories: number
    totalProducts: number
    categoryStats: Array<{
      id: number
      name: string
      productCount: number
      subcategoryCount: number
    }>
  }
  error?: string
}> {
  try {
    const [totalCategories, totalProducts, categoryStats] = await Promise.all([
      prisma.category.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              products: { where: { isActive: true } },
              subcategories: true
            }
          }
        }
      })
    ])

    return {
      success: true,
      data: {
        totalCategories,
        totalProducts,
        categoryStats: categoryStats.map(cat => ({
          id: cat.id,
          name: cat.name,
          productCount: cat._count.products,
          subcategoryCount: cat._count.subcategories
        }))
      }
    }

  } catch (error) {
    console.error('获取分类统计失败:', error)
    return {
      success: false,
      error: '获取统计信息失败'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 转换分类数据格式
function transformCategories(categories: any[]): CategoryWithStats[] {
  const categoryIcons: { [key: string]: string } = {
    '香水类': '🌸',
    '家居香氛类': '🏠',
    '个护香氛类': '🧴',
    '香氛饰品类': '💎',
    '香氛礼盒套装类': '🎁',
    '香味文创类': '📚',
    '耗材与补充品类': '🔄'
  }

  return categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image,
    icon: categoryIcons[category.name] || '🌟',
    count: category._count?.products || 0,
    subcategories: category.subcategories?.map((sub: any) => sub.name) || []
  }))
}

// 转换商品数据格式
function transformProducts(products: any[]): ProductWithDetails[] {
  return products.map(product => {
    // 计算是否为新品（7天内创建的商品）
    const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    return {
      id: product.id.toString(),
      name: product.name,
      category: product.category?.name || '',
      subcategory: product.subcategory?.name || '',
      brand: product.brand || '未知品牌',
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      imageUrl: product.images?.[0] || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
      rating: 4.5 + Math.random() * 0.5, // 模拟评分，实际项目中应该从数据库获取
      reviewCount: Math.floor(Math.random() * 2000) + 100, // 模拟评论数
      inStock: product.stock > 0,
      stock: product.stock,
      isNew,
      isHot: product.isFeatured || false
    }
  })
}

// 搜索商品
export async function searchProducts(params: {
  query: string
  categoryName?: string
  page?: number
  limit?: number
}): Promise<{
  success: boolean
  data?: {
    products: ProductWithDetails[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  error?: string
}> {
  try {
    const { query, categoryName, page = 1, limit = 20 } = params

    // 构建搜索条件
    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } }
      ]
    }

    if (categoryName) {
      where.category = { name: categoryName }
    }

    // 计算分页
    const skip = (page - 1) * limit

    // 获取搜索结果
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          subcategory: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return {
      success: true,
      data: {
        products: transformProducts(products),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

  } catch (error) {
    console.error('搜索商品失败:', error)
    return {
      success: false,
      error: '搜索失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
} 