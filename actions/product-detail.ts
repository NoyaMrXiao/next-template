'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 商品详情数据类型
export interface ProductDetail {
  id: number
  name: string
  brand: string | null
  price: number
  originalPrice: number | null
  description: string | null
  content: string | null
  sku: string
  stock: number
  weight: number | null
  volume: string | null
  images: string[]
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  inStock: boolean
  isNew: boolean
  isHot: boolean
  category: {
    id: number
    name: string
  }
  subcategory: {
    id: number
    name: string
  } | null
  features: string[]
  specifications: Array<{
    name: string
    value: string
  }>
  badge?: {
    text: string
    variant: 'default' | 'secondary' | 'destructive'
  }
}

// 获取商品详情
export async function getProductDetail(id: number): Promise<{
  success: boolean
  data?: ProductDetail
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
    const transformedProduct = transformProductDetail(product)

    return {
      success: true,
      data: transformedProduct
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
  data?: ProductDetail[]
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
    const transformedProducts = relatedProducts.map(transformProductDetail)

    return {
      success: true,
      data: transformedProducts
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

// 转换商品数据格式
function transformProductDetail(product: any): ProductDetail {
  // 计算是否为新品（7天内创建的商品）
  const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  // 模拟评分和评论数（实际项目中应该从数据库获取）
  const rating = 4.0 + Math.random() * 1.0
  const reviewCount = Math.floor(Math.random() * 3000) + 50

  // 生成商品特性
  const features = generateFeatures(product)
  
  // 生成规格参数
  const specifications = generateSpecifications(product)

  // 生成徽章
  const badge = generateBadge(product, isNew)

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    description: product.description,
    content: product.content,
    sku: product.sku,
    stock: product.stock,
    weight: product.weight ? Number(product.weight) : null,
    volume: product.volume,
    images: product.images.length > 0 ? product.images : [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop"
    ],
    tags: product.tags || [],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    rating: Number(rating.toFixed(1)),
    reviewCount,
    inStock: product.stock > 0,
    isNew,
    isHot: product.isFeatured,
    category: {
      id: product.category.id,
      name: product.category.name
    },
    subcategory: product.subcategory ? {
      id: product.subcategory.id,
      name: product.subcategory.name
    } : null,
    features,
    specifications,
    badge
  }
}

// 生成商品特性
function generateFeatures(product: any): string[] {
  const features: string[] = []
  
  if (product.category?.name === '香水类') {
    features.push('香调：花香调')
    features.push('前调：柠檬、橙花')
    features.push('中调：茉莉、玫瑰')
    features.push('后调：檀香、麝香')
    if (product.volume) features.push(`容量：${product.volume}`)
    if (product.subcategory?.name) features.push(`浓度：${product.subcategory.name}`)
  } else if (product.category?.name === '家居香氛类') {
    features.push('材质：天然植物蜡')
    features.push('燃烧时间：约60小时')
    features.push('香调：花香木质调')
    if (product.weight) features.push(`重量：${product.weight}g`)
    features.push('包装：精美礼盒装')
  } else if (product.category?.name === '香氛饰品类') {
    features.push('材质：316L不锈钢')
    features.push('链长：45cm（可调节）')
    features.push('香氛芯片：可更换设计')
    features.push('持香时间：7-10天')
    features.push('防水等级：IPX4')
  } else {
    // 通用特性
    if (product.brand) features.push(`品牌：${product.brand}`)
    if (product.volume) features.push(`规格：${product.volume}`)
    if (product.weight) features.push(`重量：${product.weight}g`)
    features.push('包装：精美包装')
    features.push('保质期：3年')
  }

  return features
}

// 生成规格参数
function generateSpecifications(product: any): Array<{ name: string; value: string }> {
  const specs: Array<{ name: string; value: string }> = [
    { name: '品牌', value: product.brand || '未知品牌' },
    { name: '产地', value: '法国' }, // 可以根据品牌或分类设置
    { name: '分类', value: product.category?.name || '未分类' }
  ]

  if (product.subcategory?.name) {
    specs.push({ name: '子分类', value: product.subcategory.name })
  }

  if (product.volume) {
    specs.push({ name: '容量/规格', value: product.volume })
  }

  if (product.weight) {
    specs.push({ name: '重量', value: `${product.weight}g` })
  }

  specs.push({ name: '保质期', value: '3年' })

  return specs
}

// 生成徽章
function generateBadge(product: any, isNew: boolean): { text: string; variant: 'default' | 'secondary' | 'destructive' } | undefined {
  if (isNew) {
    return { text: '新品', variant: 'secondary' }
  }
  
  if (product.isFeatured) {
    return { text: '热销', variant: 'destructive' }
  }

  if (product.stock <= 5 && product.stock > 0) {
    return { text: '限量', variant: 'secondary' }
  }

  return undefined
}