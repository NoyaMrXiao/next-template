'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getAllCategories } from './category'

const prisma = new PrismaClient()

// 添加商品的数据类型
export interface CreateProductData {
  categoryId: number
  subcategoryId?: number
  name: string
  description?: string
  content?: string
  brand?: string
  sku: string
  price: number
  originalPrice?: number
  stock: number
  minStock?: number
  weight?: number
  volume?: string
  images: string[]
  tags?: string[]
  isActive?: boolean
  isFeatured?: boolean
  sort?: number
}

// 更新商品的数据类型
export interface UpdateProductData extends Partial<CreateProductData> {
  id: number
}

// 商品查询参数
export interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: number
  subcategoryId?: number
  isActive?: boolean
  isFeatured?: boolean
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

// 添加商品
export async function createProduct(data: CreateProductData) {
  try {
    // 验证必填字段
    if (!data.name || !data.sku || !data.price || !data.categoryId) {
      return {
        success: false,
        error: '商品名称、SKU、价格和分类为必填项'
      }
    }

    // 验证SKU是否已存在
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku }
    })

    if (existingSku) {
      return {
        success: false,
        error: 'SKU已存在，请使用其他SKU'
      }
    }

    // 验证分类是否存在
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
      include: { subcategories: true }
    })

    if (!category) {
      return {
        success: false,
        error: '指定的分类不存在'
      }
    }

    // 如果指定了子分类，验证子分类是否存在且属于指定分类
    if (data.subcategoryId) {
      const subcategory = await prisma.subcategory.findFirst({
        where: {
          id: data.subcategoryId,
          categoryId: data.categoryId
        }
      })

      if (!subcategory) {
        return {
          success: false,
          error: '指定的子分类不存在或不属于该分类'
        }
      }
    }

    // 创建商品
    const product = await prisma.product.create({
      data: {
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        name: data.name,
        description: data.description,
        content: data.content,
        brand: data.brand,
        sku: data.sku,
        price: data.price,
        originalPrice: data.originalPrice,
        stock: data.stock,
        minStock: data.minStock,
        weight: data.weight,
        volume: data.volume,
        images: data.images,
        tags: data.tags,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        sort: data.sort || 0
      },
      include: {
        category: true,
        subcategory: true
      }
    })

    console.log('商品创建成功:', product)

    // 重新验证相关页面缓存
    revalidatePath('/admin/products')
    revalidatePath('/products')

    return {
      success: true,
      data: product,
      message: '商品添加成功'
    }

  } catch (error) {
    console.error('添加商品失败:', error)
    return {
      success: false,
      error: '添加商品失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 获取商品列表
export async function getProducts(params: ProductQueryParams = {}) {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      subcategoryId,
      isActive,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    // 构建查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (subcategoryId) {
      where.subcategoryId = subcategoryId
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive
    }

    if (typeof isFeatured === 'boolean') {
      where.isFeatured = isFeatured
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
        products: JSON.parse(JSON.stringify(products)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }

  } catch (error) {
    console.error('获取商品列表失败:', error)
    return {
      success: false,
      error: '获取商品列表失败'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 获取单个商品
export async function getProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true
      }
    })

    if (!product) {
      return {
        success: false,
        error: '商品不存在'
      }
    }

    return {
      success: true,
      data: product
    }

  } catch (error) {
    console.error('获取商品失败:', error)
    return {
      success: false,
      error: '获取商品失败'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 更新商品
export async function updateProduct(data: UpdateProductData) {
  try {
    const { id, ...updateData } = data

    // 验证商品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return {
        success: false,
        error: '商品不存在'
      }
    }

    // 如果更新SKU，检查是否与其他商品冲突
    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const skuConflict = await prisma.product.findFirst({
        where: {
          sku: updateData.sku,
          id: { not: id }
        }
      })

      if (skuConflict) {
        return {
          success: false,
          error: 'SKU已被其他商品使用'
        }
      }
    }

    // 如果更新分类，验证分类是否存在
    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoryId }
      })

      if (!category) {
        return {
          success: false,
          error: '指定的分类不存在'
        }
      }

      // 如果指定了子分类，验证子分类是否属于该分类
      if (updateData.subcategoryId) {
        const subcategory = await prisma.subcategory.findFirst({
          where: {
            id: updateData.subcategoryId,
            categoryId: updateData.categoryId
          }
        })

        if (!subcategory) {
          return {
            success: false,
            error: '指定的子分类不存在或不属于该分类'
          }
        }
      }
    }

    // 更新商品
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        subcategory: true
      }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath(`/products/${id}`)

    return {
      success: true,
      data: product,
      message: '商品更新成功'
    }

  } catch (error) {
    console.error('更新商品失败:', error)
    return {
      success: false,
      error: '更新商品失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 删除商品
export async function deleteProduct(id: number) {
  try {
    // 验证商品是否存在
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return {
        success: false,
        error: '商品不存在'
      }
    }

    // 删除商品
    await prisma.product.delete({
      where: { id }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/products')
    revalidatePath('/products')

    return {
      success: true,
      message: '商品删除成功'
    }

  } catch (error) {
    console.error('删除商品失败:', error)
    return {
      success: false,
      error: '删除商品失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 批量更新商品状态
export async function batchUpdateProductStatus(ids: number[], isActive: boolean) {
  try {
    if (ids.length === 0) {
      return {
        success: false,
        error: '请选择要操作的商品'
      }
    }

    // 批量更新
    const result = await prisma.product.updateMany({
      where: {
        id: { in: ids }
      },
      data: {
        isActive
      }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/products')
    revalidatePath('/products')

    return {
      success: true,
      data: { count: result.count },
      message: `成功${isActive ? '上架' : '下架'} ${result.count} 个商品`
    }

  } catch (error) {
    console.error('批量更新商品状态失败:', error)
    return {
      success: false,
      error: '批量更新失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 批量删除商品
export async function batchDeleteProducts(ids: number[]) {
  try {
    if (ids.length === 0) {
      return {
        success: false,
        error: '请选择要删除的商品'
      }
    }

    // 批量删除
    const result = await prisma.product.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/products')
    revalidatePath('/products')

    return {
      success: true,
      data: { count: result.count },
      message: `成功删除 ${result.count} 个商品`
    }

  } catch (error) {
    console.error('批量删除商品失败:', error)
    return {
      success: false,
      error: '批量删除失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 获取商品统计信息
export async function getProductStats() {
  try {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      featuredProducts,
      outOfStockProducts
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
      prisma.product.count({ where: { stock: { lte: 10 } } }),
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.product.count({ where: { stock: 0 } })
    ])

    // 按分类统计
    const categoryStats = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return {
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          inactiveProducts,
          lowStockProducts,
          featuredProducts,
          outOfStockProducts
        },
        categoryStats: categoryStats.map(cat => ({
          id: cat.id,
          name: cat.name,
          productCount: cat._count.products
        }))
      }
    }

  } catch (error) {
    console.error('获取商品统计失败:', error)
    return {
      success: false,
      error: '获取统计信息失败'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 获取所有分类（用于表单选择）
export async function getCategories() {
  // 使用分类action中的函数
  return await getAllCategories()
}

// 生成唯一的 SKU
export async function generateSKU(prefix: string = 'PRD') {
  try {
    // 获取今天的日期，格式：YYYYMMDD
    const today = new Date()
    const dateStr = today.getFullYear().toString() + 
                   (today.getMonth() + 1).toString().padStart(2, '0') + 
                   today.getDate().toString().padStart(2, '0')
    
    // 查询今天创建的商品数量
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    const count = await prisma.product.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    })

    // 生成 SKU：前缀 + 日期 + 序号（3位）
    const sequence = (count + 1).toString().padStart(3, '0')
    const sku = `${prefix}${dateStr}${sequence}`

    // 检查SKU是否已存在，如果存在则递增序号
    let finalSku = sku
    let counter = count + 1
    while (await prisma.product.findUnique({ where: { sku: finalSku } })) {
      counter++
      const newSequence = counter.toString().padStart(3, '0')
      finalSku = `${prefix}${dateStr}${newSequence}`
    }

    return {
      success: true,
      data: finalSku
    }

  } catch (error) {
    console.error('生成SKU失败:', error)
    return {
      success: false,
      error: '生成SKU失败'
    }
  } finally {
    await prisma.$disconnect()
  }
}