'use server'

import { prisma } from '@/lib/prisma'

export interface SearchParams {
  q?: string
  category?: string
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  minPrice?: number
  maxPrice?: number
}

export interface SearchResult {
  products: Array<{
    id: number
    name: string
    description: string | null
    brand: string | null
    sku: string
    price: number
    originalPrice: number | null
    images: string[]
    tags: string[]
    isActive: boolean
    isFeatured: boolean
    category: {
      id: number
      name: string
    }
    subcategory: {
      id: number
      name: string
    } | null
    _count?: {
      orderItems: number
    }
  }>
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
  }
  filters: {
    categories: Array<{
      id: number
      name: string
      count: number
    }>
    priceRange: {
      min: number
      max: number
    }
    brands: Array<{
      name: string
      count: number
    }>
  }
}

// 搜索商品
export async function searchProducts(params: SearchParams = {}): Promise<SearchResult> {
  try {
    const {
      q = '',
      category,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice
    } = params

    // 构建查询条件
    const where: any = {
      isActive: true
    }

    // 搜索关键词
    if (q.trim()) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { tags: { hasSome: q.split(' ').filter(Boolean) } }
      ]
    }

    // 分类筛选
    if (category) {
      if (category !== 'all') {
        where.category = {
          name: { contains: category, mode: 'insensitive' }
        }
      }
    }

    // 价格筛选
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) {
        where.price.gte = minPrice
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice
      }
    }

    // 计算分页
    const skip = (page - 1) * limit

    // 排序
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // 获取商品列表和总数
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          subcategory: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              orderItems: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // 获取筛选器数据
    const [categoryStats, priceStats, brandStats] = await Promise.all([
      // 分类统计
      prisma.product.groupBy({
        by: ['categoryId'],
        where: q.trim() ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { brand: { contains: q, mode: 'insensitive' } }
          ],
          isActive: true
        } : { isActive: true },
        _count: true
      }),
      // 价格统计
      prisma.product.aggregate({
        where: q.trim() ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { brand: { contains: q, mode: 'insensitive' } }
          ],
          isActive: true
        } : { isActive: true },
        _min: { price: true },
        _max: { price: true }
      }),
      // 品牌统计
      prisma.product.groupBy({
        by: ['brand'],
        where: {
          ...(q.trim() ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { brand: { contains: q, mode: 'insensitive' } }
            ]
          } : {}),
          isActive: true,
          brand: {
            not: null
          }
        },
        _count: true
      })
    ])

    // 获取分类信息
    const categoryIds = categoryStats.map(stat => stat.categoryId)
    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds }
      },
      select: {
        id: true,
        name: true
      }
    })

    // 构建分类筛选器
    const categoryFilters = categoryStats.map(stat => {
      const category = categories.find(c => c.id === stat.categoryId)
      return {
        id: stat.categoryId,
        name: category?.name || '未知分类',
        count: stat._count
      }
    })

    // 构建品牌筛选器
    const brandFilters = brandStats
      .filter(stat => stat.brand)
      .map(stat => ({
        name: stat.brand!,
        count: stat._count
      }))
      .sort((a, b) => b.count - a.count)

    const totalPages = Math.ceil(totalCount / limit)

    return {
      products: products.map(product => ({
        ...product,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit
      },
      filters: {
        categories: categoryFilters,
        priceRange: {
          min: Number(priceStats._min.price) || 0,
          max: Number(priceStats._max.price) || 0
        },
        brands: brandFilters
      }
    }

  } catch (error) {
    console.error('搜索商品失败:', error)
    throw new Error('搜索失败，请稍后重试')
  }
}

// 获取搜索建议
export async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    if (!query.trim()) {
      return []
    }

    const suggestions = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ]
      },
      select: {
        name: true,
        brand: true,
        tags: true
      },
      take: 10
    })

    const suggestionSet = new Set<string>()
    
    suggestions.forEach(product => {
      // 添加产品名称
      if (product.name.toLowerCase().includes(query.toLowerCase())) {
        suggestionSet.add(product.name)
      }
      
      // 添加品牌
      if (product.brand && product.brand.toLowerCase().includes(query.toLowerCase())) {
        suggestionSet.add(product.brand)
      }
      
      // 添加相关标签
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestionSet.add(tag)
        }
      })
    })

    return Array.from(suggestionSet).slice(0, 8)

  } catch (error) {
    console.error('获取搜索建议失败:', error)
    return []
  }
}

// 获取热门搜索关键词
export async function getHotSearchKeywords(): Promise<string[]> {
  try {
    // 获取最受欢迎的商品（根据订单数量）
    const hotProducts = await prisma.product.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            orderItems: true
          }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      },
      take: 10
    })

    const hotKeywords = new Set<string>()
    
    hotProducts.forEach(product => {
      // 添加品牌
      if (product.brand) {
        hotKeywords.add(product.brand)
      }
      
      // 添加标签
      product.tags.forEach(tag => {
        hotKeywords.add(tag)
      })
    })

    // 默认热门关键词
    const defaultKeywords = ['香水', '香薰', '礼盒', '限量版', '新品']
    defaultKeywords.forEach(keyword => hotKeywords.add(keyword))

    return Array.from(hotKeywords).slice(0, 8)

  } catch (error) {
    console.error('获取热门搜索关键词失败:', error)
    return ['香水', '香薰', '礼盒', '限量版', '新品']
  }
} 