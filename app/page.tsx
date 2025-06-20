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
    <div className="min-h-screen bg-white">
      {/* 英雄区域 - 全屏优雅展示 */}
      <section className="relative">
        <HomeHero />
      </section>

      {/* 品牌故事区域 - 紧跟英雄区域 */}
      <section className="relative">
        <HomeStory />
      </section>

      {/* 特色促销区域 - 优雅的横幅 */}
      <section className="relative bg-primary">
        <HomePromotion />
      </section>

      {/* 香氛分类 - 网格布局 */}
      <section className="relative bg-primary/50 py-16">
        <HomeCategories categories={categories} />
      </section>

      {/* 精选产品 - 优雅展示 */}
      <section className="relative bg-primary py-16">
        <HomeProducts 
          featuredProducts={featuredProducts}
          newProducts={newProducts}
          hotProducts={hotProducts}
        />
      </section>

      {/* 品牌特色 - 简洁图标展示 */}
      <section className="relative bg-primary/50 py-16">
        <HomeFeatures />
      </section>
    </div>
  )
}

/**
 * 优雅的加载动画组件
 */
function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse ${className}`} />
  )
}

/**
 * 加载中骨架屏组件 - 极简优雅版本
 */
function HomeContentSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* 英雄区域骨架 - 极简全屏 */}
      <section className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
          <SkeletonPulse className="h-2 w-24 rounded-full mx-auto" />
          <div className="space-y-4">
            <SkeletonPulse className="h-16 w-80 rounded mx-auto" />
            <SkeletonPulse className="h-6 w-96 rounded mx-auto" />
          </div>
          <div className="flex justify-center space-x-4">
            <SkeletonPulse className="h-12 w-32 rounded-full" />
            <SkeletonPulse className="h-12 w-24 rounded-full" />
          </div>
        </div>
      </section>
      
      {/* 品牌故事区域骨架 - 简洁双栏 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <SkeletonPulse className="h-2 w-20 rounded-full" />
            <div className="space-y-4">
              <SkeletonPulse className="h-12 w-full rounded" />
              <SkeletonPulse className="h-12 w-4/5 rounded" />
            </div>
            <div className="space-y-3">
              <SkeletonPulse className="h-4 w-full rounded" />
              <SkeletonPulse className="h-4 w-5/6 rounded" />
              <SkeletonPulse className="h-4 w-4/5 rounded" />
            </div>
            <div className="flex space-x-4">
              <SkeletonPulse className="h-12 w-32 rounded-full" />
              <SkeletonPulse className="h-12 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-80 h-80">
              <SkeletonPulse className="absolute inset-0 rounded-full" />
              <SkeletonPulse className="absolute inset-8 rounded-full bg-white" />
              <SkeletonPulse className="absolute inset-16 rounded-full" />
            </div>
          </div>
        </div>
      </section>
      
      {/* 促销区域骨架 - 简洁横幅 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SkeletonPulse className="h-48 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
      
      {/* 分类骨架 - 极简网格 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <SkeletonPulse className="h-2 w-20 rounded-full mx-auto" />
          <SkeletonPulse className="h-10 w-64 rounded mx-auto" />
          <SkeletonPulse className="h-4 w-80 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <SkeletonPulse className="aspect-square rounded" />
              <div className="text-center space-y-2">
                <SkeletonPulse className="h-4 w-24 rounded mx-auto" />
                <SkeletonPulse className="h-3 w-32 rounded mx-auto" />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <SkeletonPulse className="h-12 w-36 rounded-full mx-auto" />
        </div>
      </section>
      
      {/* 商品骨架 - 优雅标签与网格 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
        <div className="text-center mb-16 space-y-4">
          <SkeletonPulse className="h-10 w-48 rounded mx-auto" />
          <SkeletonPulse className="h-4 w-96 rounded mx-auto" />
        </div>
        
        {/* 标签导航骨架 */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* 产品网格骨架 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <SkeletonPulse className="aspect-square rounded" />
              <div className="space-y-2">
                <SkeletonPulse className="h-4 w-5/6 rounded" />
                <SkeletonPulse className="h-3 w-1/2 rounded" />
                <SkeletonPulse className="h-5 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <SkeletonPulse className="h-12 w-40 rounded-full mx-auto" />
        </div>
      </section>
      
      {/* 特性区域骨架 - 简洁卡片 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <SkeletonPulse className="h-10 w-64 rounded mx-auto" />
          <SkeletonPulse className="h-4 w-96 rounded mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="text-center space-y-6 p-8">
              <SkeletonPulse className="h-16 w-16 rounded-full mx-auto" />
              <div className="space-y-3">
                <SkeletonPulse className="h-5 w-24 rounded mx-auto" />
                <SkeletonPulse className="h-4 w-40 rounded mx-auto" />
                <SkeletonPulse className="h-4 w-32 rounded mx-auto" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16 pt-8 border-t border-gray-100">
          <SkeletonPulse className="h-3 w-48 rounded mx-auto" />
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
    <>
      {/* 主要内容 */}
      <Suspense fallback={<HomeContentSkeleton />}>
        <HomeContent />
      </Suspense>

      {/* 页脚 */}
      <HomeFooter />
    </>
  )
}