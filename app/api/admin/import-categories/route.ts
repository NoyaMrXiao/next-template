import { NextRequest, NextResponse } from 'next/server'
import { createPresetCategories } from '@/actions/category'
import { createPresetSubcategories } from '@/actions/subcategory'
import { convertToStandardFormat, getCategoryStats, CATEGORY_MAP, SUBCATEGORY_MAP } from '@/lib/product'

// 定义返回类型
type ActionResult = {
  success: boolean
  data?: any[]
  message?: string
  error?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'all'
    const format = searchParams.get('format') // 可选：返回格式化数据

    // 如果只是查看数据结构，不执行导入
    if (format === 'preview') {
      const standardData = convertToStandardFormat()
      const stats = getCategoryStats()
      
      return NextResponse.json({
        success: true,
        message: '数据结构预览',
        data: {
          format: 'preview',
          categories: standardData,
          statistics: stats,
          mappings: {
            categoryMap: CATEGORY_MAP,
            subcategoryMap: SUBCATEGORY_MAP
          },
          timestamp: new Date().toISOString()
        }
      })
    }

    let results = {
      categories: { success: false, data: [], message: '', error: '' } as ActionResult,
      subcategories: { success: false, data: [], message: '', error: '' } as ActionResult,
      summary: {
        totalCategories: 0,
        totalSubcategories: 0,
        errors: [] as string[]
      }
    }

    // 根据action参数决定执行什么操作
    switch (action) {
      case 'categories':
        // 只导入分类
        console.log('开始导入分类...')
        results.categories = await createPresetCategories()
        break
        
      case 'subcategories':
        // 只导入子分类（需要先有分类）
        console.log('开始导入子分类...')
        results.subcategories = await createPresetSubcategories()
        break
        
      case 'all':
      default:
        // 导入所有（分类 + 子分类）
        console.log('开始导入分类...')
        results.categories = await createPresetCategories()
        
        if (results.categories.success) {
          console.log('分类导入成功，开始导入子分类...')
          // 等待一下确保分类创建完成
          await new Promise(resolve => setTimeout(resolve, 1000))
          results.subcategories = await createPresetSubcategories()
        } else {
          results.summary.errors.push('分类导入失败，跳过子分类导入')
        }
        break
    }

    // 统计结果
    if (results.categories.success && results.categories.data) {
      results.summary.totalCategories = Array.isArray(results.categories.data) 
        ? results.categories.data.length 
        : 0
    }

    if (results.subcategories.success && results.subcategories.data) {
      results.summary.totalSubcategories = Array.isArray(results.subcategories.data) 
        ? results.subcategories.data.length 
        : 0
    }

    // 收集错误信息
    if (!results.categories.success && results.categories.error) {
      results.summary.errors.push(`分类导入错误: ${results.categories.error}`)
    }
    if (!results.subcategories.success && results.subcategories.error) {
      results.summary.errors.push(`子分类导入错误: ${results.subcategories.error}`)
    }

    // 返回结果
    const isSuccess = (action === 'categories' && results.categories.success) ||
                     (action === 'subcategories' && results.subcategories.success) ||
                     (action === 'all' && results.categories.success && results.subcategories.success)

    const stats = getCategoryStats()

    return NextResponse.json({
      success: isSuccess,
      message: `导入完成 - 分类: ${results.summary.totalCategories}个, 子分类: ${results.summary.totalSubcategories}个`,
      data: {
        action,
        results,
        statistics: stats,
        standardFormat: convertToStandardFormat(),
        timestamp: new Date().toISOString()
      }
    }, { 
      status: isSuccess ? 200 : 207 // 207 表示部分成功
    })

  } catch (error) {
    console.error('导入分类结构失败:', error)
    
    return NextResponse.json({
      success: false,
      error: '导入分类结构失败',
      details: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}