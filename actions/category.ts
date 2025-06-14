 'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// 分类数据类型
export interface CreateCategoryData {
  name: string
  description?: string
  image?: string
  sort?: number
  isActive?: boolean
}

export interface UpdateCategoryData extends CreateCategoryData {
  id: number
}

// 创建大分类
export async function createCategory(data: CreateCategoryData) {
  try {
    // 验证必填字段
    if (!data.name) {
      return {
        success: false,
        error: '分类名称为必填项'
      }
    }

    // 检查分类名称是否已存在
    const existingCategory = await prisma.category.findUnique({
      where: { name: data.name }
    })

    if (existingCategory) {
      return {
        success: false,
        error: '分类名称已存在'
      }
    }

    // 创建分类
    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        sort: data.sort || 0,
        isActive: data.isActive ?? true
      }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/categories')
    revalidatePath('/admin/products')

    return {
      success: true,
      data: category,
      message: '分类创建成功'
    }

  } catch (error) {
    console.error('创建分类失败:', error)
    return {
      success: false,
      error: '创建分类失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 获取所有分类
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { sort: 'asc' }
        },
        _count: {
          select: { 
            products: true,
            subcategories: true 
          }
        }
      },
      orderBy: { sort: 'asc' }
    })

    return {
      success: true,
      data: categories
    }

  } catch (error) {
    console.error('获取分类失败:', error)
    return {
      success: false,
      error: '获取分类失败'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 更新分类
export async function updateCategory(data: UpdateCategoryData) {
  try {
    // 验证必填字段
    if (!data.id || !data.name) {
      return {
        success: false,
        error: '分类ID和名称为必填项'
      }
    }

    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id: data.id }
    })

    if (!existingCategory) {
      return {
        success: false,
        error: '分类不存在'
      }
    }

    // 检查名称是否与其他分类冲突
    const nameConflict = await prisma.category.findFirst({
      where: {
        name: data.name,
        id: { not: data.id }
      }
    })

    if (nameConflict) {
      return {
        success: false,
        error: '分类名称已被其他分类使用'
      }
    }

    // 更新分类
    const category = await prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        sort: data.sort,
        isActive: data.isActive
      }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/categories')
    revalidatePath('/admin/products')

    return {
      success: true,
      data: category,
      message: '分类更新成功'
    }

  } catch (error) {
    console.error('更新分类失败:', error)
    return {
      success: false,
      error: '更新分类失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 删除分类
export async function deleteCategory(id: number) {
  try {
    // 检查分类是否存在
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
        subcategories: true
      }
    })

    if (!existingCategory) {
      return {
        success: false,
        error: '分类不存在'
      }
    }

    // 检查是否有关联的商品
    if (existingCategory.products.length > 0) {
      return {
        success: false,
        error: `无法删除分类，还有 ${existingCategory.products.length} 个商品属于此分类`
      }
    }

    // 检查是否有子分类
    if (existingCategory.subcategories.length > 0) {
      return {
        success: false,
        error: `无法删除分类，还有 ${existingCategory.subcategories.length} 个子分类属于此分类`
      }
    }

    // 删除分类
    await prisma.category.delete({
      where: { id }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/categories')
    revalidatePath('/admin/products')

    return {
      success: true,
      message: '分类删除成功'
    }

  } catch (error) {
    console.error('删除分类失败:', error)
    return {
      success: false,
      error: '删除分类失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 批量创建预设分类
export async function createPresetCategories() {
  try {
    const presetCategories = [
      {
        name: "香水类",
        description: "各种类型的香水产品",
        sort: 1,
        isActive: true
      },
      {
        name: "家居香氛类", 
        description: "家居香氛相关产品",
        sort: 2,
        isActive: true
      },
      {
        name: "个护香氛类",
        description: "个人护理香氛产品", 
        sort: 3,
        isActive: true
      },
      {
        name: "香氛饰品类",
        description: "香氛相关饰品",
        sort: 4,
        isActive: true
      },
      {
        name: "香氛礼盒套装类",
        description: "香氛礼盒和套装",
        sort: 5,
        isActive: true
      },
      {
        name: "香味文创类",
        description: "香味主题文创产品",
        sort: 6,
        isActive: true
      },
      {
        name: "耗材与补充品类",
        description: "香氛耗材和补充装",
        sort: 7,
        isActive: true
      }
    ]

    const results = []
    for (const categoryData of presetCategories) {
      // 检查是否已存在
      const existing = await prisma.category.findUnique({
        where: { name: categoryData.name }
      })

      if (!existing) {
        const category = await prisma.category.create({
          data: categoryData
        })
        results.push(category)
      }
    }

    // 重新验证相关页面缓存
    revalidatePath('/admin/categories')
    revalidatePath('/admin/products')

    return {
      success: true,
      data: results,
      message: `成功创建 ${results.length} 个预设分类`
    }

  } catch (error) {
    console.error('创建预设分类失败:', error)
    return {
      success: false,
      error: '创建预设分类失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}