'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface IProductDetail {
  id: number
  categoryId: number
  subcategoryId: number | null
  name: string
  description: string | null
  content: string | null
  brand: string | null
  sku: string
  price: number
  originalPrice: number | null
  stock: number
  minStock: number
  weight: number | null
  volume: string | null
  images: string[]
  tags: string[]
  isActive: boolean
  isFeatured: boolean
}

// 获取商品详情
export async function getProductDetail(id: number): Promise<{
  success: boolean
  data?: IProductDetail
  error?: string
}> {
  try {
    const product = await prisma.product.findUnique({
      where: { 
        id,
        isActive: true // 只获取活跃商品
      },
      include: {
        category: true,
        subcategory: true
      }
    })

    if (!product) {
      return {
        success: false,
        error: '商品不存在或已下架'
      }
    }

    // 转换数据格式

    return {
      success: true,
      data: JSON.parse(JSON.stringify(product))
    }

  } catch (error) {
    console.error('获取商品详情失败:', error)
    return {
      success: false,
      error: '获取商品详情失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 获取相关商品推荐
export async function getRelatedProducts(productId: number, limit: number = 8): Promise<{
  success: boolean
  data?: IProductDetail[]
  error?: string
}> {
  try {
    // 先获取当前商品信息
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, subcategory: true }
    })

    if (!currentProduct) {
      return {
        success: false,
        error: '商品不存在'
      }
    }

    // 获取相关商品：同分类或同子分类的其他商品
    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } }, // 排除当前商品
          { isActive: true }, // 只获取活跃商品
          {
            OR: [
              { categoryId: currentProduct.categoryId }, // 同分类
              currentProduct.subcategoryId ? { subcategoryId: currentProduct.subcategoryId } : {} // 同子分类
            ]
          }
        ]
      },
      include: {
        category: true,
        subcategory: true
      },
      orderBy: [
        { isFeatured: 'desc' }, // 优先推荐精选商品
        { createdAt: 'desc' } // 然后按创建时间排序
      ],
      take: limit
    })

    // 如果相关商品不够，补充其他热门商品
    if (relatedProducts.length < limit) {
      const additionalProducts = await prisma.product.findMany({
        where: {
          AND: [
            { id: { not: productId } },
            { id: { notIn: relatedProducts.map(p => p.id) } },
            { isActive: true },
            { isFeatured: true } // 获取精选商品
          ]
        },
        include: {
          category: true,
          subcategory: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit - relatedProducts.length
      })

      relatedProducts.push(...additionalProducts)
    }

    // 转换数据格式

    return {
      success: true,
      data: JSON.parse(JSON.stringify(relatedProducts))
    }

  } catch (error) {
    console.error('获取相关商品失败:', error)
    return {
      success: false,
      error: '获取相关商品失败'
    }
  } finally {
    await prisma.$disconnect()
  }
}
