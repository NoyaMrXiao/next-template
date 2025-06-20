import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ArrowRight, Star, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/types"

// ===========================================
// 类型定义
// ===========================================

interface HomeProductsProps {
  featuredProducts: Product[]
  newProducts: Product[]
  hotProducts: Product[]
}

// ===========================================
// 子组件
// ===========================================

/**
 * 产品网格组件
 */
function ProductGrid({ products, emptyMessage }: { products: Product[]; emptyMessage: string }) {
  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="text-gray-400 mb-4">
          <Star className="w-12 h-12 mx-auto mb-2" />
        </div>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          viewMode="grid"
          showBadges={true}
          showRating={true}
        />
      ))}
    </div>
  )
}

// ===========================================
// 主组件
// ===========================================

/**
 * 首页产品展示组件
 */
export function HomeProducts({ 
  featuredProducts, 
  newProducts, 
  hotProducts
}: HomeProductsProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
          精选
          <span className="font-normal text-gray-700">商品</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          严选全球知名品牌，为您呈现最优质的香氛产品
        </p>
      </div>

      <Tabs defaultValue="featured" className="space-y-12">
        {/* 标签导航 */}
        <div className="flex justify-center">
          <TabsList className="bg-primary p-1 rounded-full">
            <TabsTrigger 
              value="featured" 
              className="flex items-center space-x-2 px-6 py-3 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Star className="w-4 h-4" />
              <span>精选推荐</span>
            </TabsTrigger>
            <TabsTrigger 
              value="new" 
              className="flex items-center space-x-2 px-6 py-3 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <span>新品上市</span>
            </TabsTrigger>
            <TabsTrigger 
              value="hot" 
              className="flex items-center space-x-2 px-6 py-3 rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              <span>热销榜单</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* 精选推荐 */}
        <TabsContent value="featured" className="space-y-8">
          <ProductGrid 
            products={featuredProducts} 
            emptyMessage="暂无精选商品" 
          />
        </TabsContent>
        
        {/* 新品上市 */}
        <TabsContent value="new" className="space-y-8">
          <ProductGrid 
            products={newProducts} 
            emptyMessage="暂无新品商品" 
          />
        </TabsContent>
        
        {/* 热销榜单 */}
        <TabsContent value="hot" className="space-y-8">
          <ProductGrid 
            products={hotProducts} 
            emptyMessage="暂无热销商品" 
          />
        </TabsContent>
      </Tabs>

      {/* 查看更多按钮 */}
      <div className="text-center mt-16">
        <Link href="/products">
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
          >
            查看更多商品
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  )
} 