import { Suspense } from 'react'
import { ProductManagement } from '@/components/admin/product-management-simple'
import CreateProductDialog from '@/components/admin/create-product-form'
import { getProductStats } from '@/actions/product'
import { Card, CardContent } from '@/components/ui/card'
import { Package, TrendingUp, AlertTriangle, Star } from 'lucide-react'

// 统计卡片组件
async function StatsCards() {
  const statsResult = await getProductStats()
  
  if (!statsResult.success || !statsResult.data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              统计数据加载失败
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { overview } = statsResult.data

  const stats = [
    {
      title: '总商品数',
      value: overview.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '已上架',
      value: overview.activeProducts,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '库存不足',
      value: overview.lowStockProducts,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: '精选商品',
      value: overview.featuredProducts,
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// 加载中的统计卡片
function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ProductsManagePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 页面头部 */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-600 mt-2">管理商品的上下架状态和基本信息</p>
        </div>
        <div className="flex gap-3">
          <CreateProductDialog />
        </div>
      </div>

      {/* 统计卡片 */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* 商品管理表格 */}
      <div className="bg-white rounded-lg shadow-sm">
        <ProductManagement />
      </div>
    </div>
  )
} 