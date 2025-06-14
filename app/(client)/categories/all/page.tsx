import { Suspense } from "react"
import { getCategoriesPageData } from "@/actions/categories-page"
import { AllCategoriesClient } from "@/app/(client)/categories/all/client"


// 加载中组件
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50 pt-16">
      <div className="flex">
        {/* 左侧骨架 */}
        <aside className="hidden md:block w-80 h-screen sticky top-16">
          <div className="bg-white border-r border-gray-100 p-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-xl"></div>
              ))}
            </div>
          </div>
        </aside>
        
        {/* 右侧骨架 */}
        <main className="flex-1 p-4 md:p-8">
          <div className="h-12 bg-gray-200 animate-pulse rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

// 服务器端页面组件
export default async function AllCategoriesPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>
}) {
  const params = await searchParams
  
  // 使用新的action获取页面数据
  const result = await getCategoriesPageData({
    category: params.category,
    subcategory: params.subcategory,
    limit: 100
  })

  // 如果获取数据失败，显示错误状态
  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">加载失败</h2>
          <p className="text-gray-600 mb-6">{result.error || '获取数据失败，请稍后重试'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  const { categories, products } = result.data

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AllCategoriesClient
        categories={categories}
        products={products}
        initialCategory={params.category}
        initialSubcategory={params.subcategory}
      />
    </Suspense>
  )
} 