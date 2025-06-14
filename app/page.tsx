import { getAllCategories } from "@/actions/category"
import { getProducts } from "@/actions/product"
import { Suspense } from "react"
import { HomeHero } from "@/components/home/home-hero"
import { HomePromotion } from "@/components/home/home-promotion"
import { HomeCategories } from "@/components/home/home-categories"
import { HomeProducts } from "@/components/home/home-products"
import { HomeFeatures } from "@/components/home/home-features"
import { HomeStory } from "@/components/home/home-story"
import { HomeFooter } from "@/components/home/home-footer"

// 获取首页数据
async function getHomePageData() {
  try {
    // 并行获取分类和商品数据
    const [categoriesResult, featuredProductsResult, newProductsResult, hotProductsResult] = await Promise.all([
      getAllCategories(),
      getProducts({ isFeatured: true, isActive: true, limit: 8 }),
      getProducts({ isActive: true, sortBy: 'createdAt', sortOrder: 'desc', limit: 8 }),
      getProducts({ isActive: true, sortBy: 'createdAt', sortOrder: 'desc', limit: 8 }) // 可以根据销量或其他指标排序
    ])

    return {
      categories: categoriesResult.success ? categoriesResult.data || [] : [],
      featuredProducts: featuredProductsResult.success ? featuredProductsResult.data?.products || [] : [],
      newProducts: newProductsResult.success ? newProductsResult.data?.products || [] : [],
      hotProducts: hotProductsResult.success ? hotProductsResult.data?.products || [] : []
    }
  } catch (error) {
    console.error('获取首页数据失败:', error)
    return {
      categories: [],
      featuredProducts: [],
      newProducts: [],
      hotProducts: []
    }
  }
}

// 转换分类数据格式
function transformCategories(categories: any[]) {
  const categoryIcons: { [key: string]: string } = {
    '香水类': '🌸',
    '家居香氛类': '🏠',
    '个护香氛类': '🧴',
    '香氛饰品类': '💍',
    '香氛礼盒套装类': '🎁',
    '香味文创类': '📚',
    '耗材与补充品类': '🔄'
  }

  const categoryGradients: { [key: string]: string } = {
    '香水类': 'bg-gradient-to-br from-rose-500/60 to-pink-500/60',
    '家居香氛类': 'bg-gradient-to-br from-blue-500/60 to-indigo-500/60',
    '个护香氛类': 'bg-gradient-to-br from-emerald-500/60 to-teal-500/60',
    '香氛饰品类': 'bg-gradient-to-br from-amber-500/60 to-orange-500/60',
    '香氛礼盒套装类': 'bg-gradient-to-br from-purple-500/60 to-violet-500/60',
    '香味文创类': 'bg-gradient-to-br from-cyan-500/60 to-blue-500/60',
    '耗材与补充品类': 'bg-gradient-to-br from-gray-500/60 to-slate-500/60'
  }

  return (categories || []).slice(0, 4).map(category => ({
    id: category.id.toString(),
    name: category.name,
    description: category.description || `精选${category.name}系列`,
    imageUrl: category.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
    icon: categoryIcons[category.name] || '🌟',
    gradient: categoryGradients[category.name] || 'bg-gradient-to-br from-gray-500/60 to-slate-500/60',
    subcategories: category.subcategories?.slice(0, 4).map((sub: any) => sub.name) || []
  }))
}

// 转换商品数据格式以匹配ProductCard组件
function transformProducts(products: any[]) {
  return products.map(product => ({
    id: product.id.toString(),
    name: product.name,
    brand: product.brand || '未知品牌',
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    imageUrl: product.images?.[0] || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    rating: 0, // 移除模拟评分
    reviewCount: 0, // 移除模拟评论数
    inStock: product.stock > 0,
    category: product.category?.name || '未分类',
    subcategory: product.subcategory?.name || '',
    isNew: false,
    isHot: false
  }))
}

// 首页内容组件
async function HomeContent() {
  const { categories, featuredProducts, newProducts, hotProducts } = await getHomePageData()
  
  const transformedCategories = transformCategories(categories)
  const transformedFeaturedProducts = transformProducts(featuredProducts)
  const transformedNewProducts = transformProducts(newProducts)
  const transformedHotProducts = transformProducts(hotProducts)

  return (
    <>
      <HomeHero />
      <HomePromotion />
      <HomeCategories categories={transformedCategories} />
      <HomeProducts 
        featuredProducts={transformedFeaturedProducts}
        newProducts={transformedNewProducts}
        hotProducts={transformedHotProducts}
      />
      <HomeFeatures />
      <HomeStory />
    </>
  )
}

// 加载中组件
function HomeContentSkeleton() {
  return (
    <div className="space-y-12">
      {/* 英雄区域骨架 */}
      <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
      
      {/* 分类骨架 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </section>
      
      {/* 商品骨架 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function Home() {
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