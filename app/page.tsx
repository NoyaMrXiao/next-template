import { Suspense } from "react"
import { getAllCategories } from "@/actions/category"
import { getProducts } from "@/actions/product"
import { transformCategories, transformProducts } from "@/lib/utils"
import type { Category, Product } from "@/lib/types"

// 首页组件导入
import { HomeHero } from "@/components/home/home-hero"
import { HomePromotion } from "@/components/home/home-promotion"
import { HomeCategories } from "@/components/home/home-categories"
import { HomeProducts } from "@/components/home/home-products"
import { HomeFeatures } from "@/components/home/home-features"
import { HomeStory } from "@/components/home/home-story"
import { HomeFooter } from "@/components/home/home-footer"

// ===========================================
// 类型定义
// ===========================================

interface HomePageData {
  categories: Category[]
  featuredProducts: Product[]
  newProducts: Product[]
  hotProducts: Product[]
}

// ===========================================
// 数据获取函数
// ===========================================

/**
 * 获取首页所需的所有数据
 */
async function getHomePageData(): Promise<HomePageData> {
  try {
    // 并行获取所有数据
    const [categoriesResult, featuredProductsResult, newProductsResult, hotProductsResult] = await Promise.all([
      getAllCategories(),
      getProducts({ isFeatured: true, isActive: true, limit: 8 }),
      getProducts({ isActive: true, sortBy: 'createdAt', sortOrder: 'desc', limit: 8 }),
      getProducts({ isActive: true, sortBy: 'createdAt', sortOrder: 'desc', limit: 8 }) // 可以根据销量或其他指标排序
    ])

    // 处理数据转换
    const categories = categoriesResult.success ? transformCategories(categoriesResult.data || []) : []
    const featuredProducts = featuredProductsResult.success ? transformProducts(featuredProductsResult.data?.products || []) : []
    const newProducts = newProductsResult.success ? transformProducts(newProductsResult.data?.products || []) : []
    const hotProducts = hotProductsResult.success ? transformProducts(hotProductsResult.data?.products || []) : []

    return {
      categories,
      featuredProducts,
      newProducts,
      hotProducts
    }
  } catch (error) {
    console.error('获取首页数据失败:', error)
    
    // 返回空数据作为后备
    return {
      categories: [],
      featuredProducts: [],
      newProducts: [],
      hotProducts: []
    }
  }
}

// ===========================================
// 组件定义
// ===========================================

/**
 * 首页内容组件
 */
async function HomeContent() {
  const { categories, featuredProducts, newProducts, hotProducts } = await getHomePageData()

  return (
    <>
      <HomeHero />
      <HomePromotion />
      <HomeCategories categories={categories} />
      <HomeProducts 
        featuredProducts={featuredProducts}
        newProducts={newProducts}
        hotProducts={hotProducts}
      />
      <HomeFeatures />
      <HomeStory />
    </>
  )
}

/**
 * 加载中骨架屏组件
 */
function HomeContentSkeleton() {
  return (
    <div className="space-y-12">
      {/* 英雄区域骨架 */}
      <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
      
      {/* 促销区域骨架 */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
      </section>
      
      {/* 分类骨架 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </section>
      
      {/* 商品骨架 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* 特性区域骨架 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-8 mx-auto"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-full mx-auto"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-32 mx-auto"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-48 mx-auto"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ===========================================
// 主页面组件
// ===========================================

/**
 * 首页主组件
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 主要内容 */}
      <Suspense fallback={<HomeContentSkeleton />}>
        <HomeContent />
      </Suspense>

      {/* 页脚 */}
      <HomeFooter />
    </div>
  )
}