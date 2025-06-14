'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// 子分类数据类型
export interface CreateSubcategoryData {
  categoryId: number
  name: string
  description?: string
  image?: string
  sort?: number
  isActive?: boolean
}

export interface UpdateSubcategoryData extends CreateSubcategoryData {
  id: number
}

// 创建子分类
export async function createSubcategory(data: CreateSubcategoryData) {
  try {
    // 验证必填字段
    if (!data.categoryId || !data.name) {
      return {
        success: false,
        error: '父分类和子分类名称为必填项'
      }
    }

    // 检查父分类是否存在
    const parentCategory = await prisma.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!parentCategory) {
      return {
        success: false,
        error: '指定的父分类不存在'
      }
    }

    // 检查同一父分类下子分类名称是否已存在
    const existingSubcategory = await prisma.subcategory.findFirst({
      where: {
        categoryId: data.categoryId,
        name: data.name
      }
    })

    if (existingSubcategory) {
      return {
        success: false,
        error: '该分类下已存在同名子分类'
      }
    }

    // 创建子分类
    const subcategory = await prisma.subcategory.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        image: data.image,
        sort: data.sort || 0,
        isActive: data.isActive ?? true
      },
      include: {
        category: true
      }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/categories')
    revalidatePath('/admin/products')

    return {
      success: true,
      data: subcategory,
      message: '子分类创建成功'
    }

  } catch (error) {
    console.error('创建子分类失败:', error)
    return {
      success: false,
      error: '创建子分类失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 获取指定分类的所有子分类
export async function getSubcategoriesByCategory(categoryId: number) {
  try {
    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId },
      include: {
        category: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { sort: 'asc' }
    })

    return {
      success: true,
      data: subcategories
    }

  } catch (error) {
    console.error('获取子分类失败:', error)
    return {
      success: false,
      error: '获取子分类失败'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 获取所有子分类
export async function getAllSubcategories() {
  try {
    const subcategories = await prisma.subcategory.findMany({
      include: {
        category: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: [
        { categoryId: 'asc' },
        { sort: 'asc' }
      ]
    })

    return {
      success: true,
      data: subcategories
    }

  } catch (error) {
    console.error('获取子分类失败:', error)
    return {
      success: false,
      error: '获取子分类失败'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 更新子分类
export async function updateSubcategory(data: UpdateSubcategoryData) {
  try {
    // 验证必填字段
    if (!data.id || !data.categoryId || !data.name) {
      return {
        success: false,
        error: '子分类ID、父分类和名称为必填项'
      }
    }

    // 检查子分类是否存在
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id: data.id }
    })

    if (!existingSubcategory) {
      return {
        success: false,
        error: '子分类不存在'
      }
    }

    // 检查父分类是否存在
    const parentCategory = await prisma.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!parentCategory) {
      return {
        success: false,
        error: '指定的父分类不存在'
      }
    }

    // 检查同一父分类下名称是否与其他子分类冲突
    const nameConflict = await prisma.subcategory.findFirst({
      where: {
        categoryId: data.categoryId,
        name: data.name,
        id: { not: data.id }
      }
    })

    if (nameConflict) {
      return {
        success: false,
        error: '该分类下已存在同名子分类'
      }
    }

    // 更新子分类
    const subcategory = await prisma.subcategory.update({
      where: { id: data.id },
      data: {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        image: data.image,
        sort: data.sort,
        isActive: data.isActive
      },
      include: {
        category: true
      }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/categories')
    revalidatePath('/admin/products')

    return {
      success: true,
      data: subcategory,
      message: '子分类更新成功'
    }

  } catch (error) {
    console.error('更新子分类失败:', error)
    return {
      success: false,
      error: '更新子分类失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 删除子分类
export async function deleteSubcategory(id: number) {
  try {
    // 检查子分类是否存在
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id },
      include: {
        products: true
      }
    })

    if (!existingSubcategory) {
      return {
        success: false,
        error: '子分类不存在'
      }
    }

    // 检查是否有关联的商品
    if (existingSubcategory.products.length > 0) {
      return {
        success: false,
        error: `无法删除子分类，还有 ${existingSubcategory.products.length} 个商品属于此子分类`
      }
    }

    // 删除子分类
    await prisma.subcategory.delete({
      where: { id }
    })

    // 重新验证相关页面缓存
    revalidatePath('/admin/categories')
    revalidatePath('/admin/products')

    return {
      success: true,
      message: '子分类删除成功'
    }

  } catch (error) {
    console.error('删除子分类失败:', error)
    return {
      success: false,
      error: '删除子分类失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 批量创建预设子分类
export async function createPresetSubcategories() {
  try {
    // 获取所有分类
    const categories = await prisma.category.findMany()
    const categoryMap = new Map(categories.map(c => [c.name, c.id]))

    const presetSubcategories = [
      // 香水类子分类
      { categoryName: "香水类", name: "香精（Parfum）", sort: 1 },
      { categoryName: "香水类", name: "淡香精（Eau de Parfum）", sort: 2 },
      { categoryName: "香水类", name: "淡香水（Eau de Toilette）", sort: 3 },
      { categoryName: "香水类", name: "古龙水（Eau de Cologne）", sort: 4 },
      { categoryName: "香水类", name: "滚珠香水", sort: 5 },
      { categoryName: "香水类", name: "固体香水", sort: 6 },

      // 家居香氛类子分类
      { categoryName: "家居香氛类", name: "香薰蜡烛", sort: 1 },
      { categoryName: "家居香氛类", name: "藤条香薰", sort: 2 },
      { categoryName: "家居香氛类", name: "空气喷雾", sort: 3 },
      { categoryName: "家居香氛类", name: "香氛仪 / 香薰机", sort: 4 },
      { categoryName: "家居香氛类", name: "香氛挂件（衣柜/车载）", sort: 5 },
      { categoryName: "家居香氛类", name: "精油（单方/复方）", sort: 6 },

      // 个护香氛类子分类
      { categoryName: "个护香氛类", name: "香氛沐浴露", sort: 1 },
      { categoryName: "个护香氛类", name: "香氛身体乳", sort: 2 },
      { categoryName: "个护香氛类", name: "香氛洗发护发产品", sort: 3 },
      { categoryName: "个护香氛类", name: "香氛护手霜", sort: 4 },
      { categoryName: "个护香氛类", name: "香体喷雾", sort: 5 },

      // 香氛饰品类子分类
      { categoryName: "香氛饰品类", name: "香氛项链 / 手链", sort: 1 },
      { categoryName: "香氛饰品类", name: "香氛挂件", sort: 2 },
      { categoryName: "香氛饰品类", name: "固态香料珠 / 吊坠芯片", sort: 3 },

      // 香氛礼盒套装类子分类
      { categoryName: "香氛礼盒套装类", name: "香水礼盒", sort: 1 },
      { categoryName: "香氛礼盒套装类", name: "家居香氛礼盒", sort: 2 },
      { categoryName: "香氛礼盒套装类", name: "旅行香氛套装", sort: 3 },
      { categoryName: "香氛礼盒套装类", name: "情绪主题香氛礼盒", sort: 4 },

      // 香味文创类子分类
      { categoryName: "香味文创类", name: "香味明信片 / 书签", sort: 1 },
      { categoryName: "香味文创类", name: "气味笔记本 / 日记本", sort: 2 },
      { categoryName: "香味文创类", name: "嗅觉盲盒", sort: 3 },
      { categoryName: "香味文创类", name: "嗅觉图书 / 涂色书", sort: 4 },

      // 耗材与补充品类子分类
      { categoryName: "耗材与补充品类", name: "香氛液补充装", sort: 1 },
      { categoryName: "耗材与补充品类", name: "香芯 / 香片替换装", sort: 2 },
      { categoryName: "耗材与补充品类", name: "精油补充瓶", sort: 3 }
    ]

    const results = []
    for (const subcategoryData of presetSubcategories) {
      const categoryId = categoryMap.get(subcategoryData.categoryName)
      if (!categoryId) continue

      // 检查是否已存在
      const existing = await prisma.subcategory.findFirst({
        where: {
          categoryId,
          name: subcategoryData.name
        }
      })

      if (!existing) {
        const subcategory = await prisma.subcategory.create({
          data: {
            categoryId,
            name: subcategoryData.name,
            sort: subcategoryData.sort,
            isActive: true
          }
        })
        results.push(subcategory)
      }
    }

    // 重新验证相关页面缓存
    revalidatePath('/admin/categories')
    revalidatePath('/admin/products')

    return {
      success: true,
      data: results,
      message: `成功创建 ${results.length} 个预设子分类`
    }

  } catch (error) {
    console.error('创建预设子分类失败:', error)
    return {
      success: false,
      error: '创建预设子分类失败，请稍后重试'
    }
  } finally {
    await prisma.$disconnect()
  }
} 