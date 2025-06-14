import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
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
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Tabs defaultValue="featured" className="space-y-6">
        {/* 标题和导航栏 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">精选商品</h2>
            <p className="text-gray-600 mt-1">
              严选全球知名品牌，为您呈现最优质的香氛产品
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="featured">精选推荐</TabsTrigger>
            <TabsTrigger value="new">新品上市</TabsTrigger>
            <TabsTrigger value="hot">热销榜单</TabsTrigger>
          </TabsList>
        </div>
        
        {/* 精选推荐 */}
        <TabsContent value="featured" className="space-y-6">
          <ProductGrid 
            products={featuredProducts} 
            emptyMessage="暂无精选商品" 
          />
        </TabsContent>
        
        {/* 新品上市 */}
        <TabsContent value="new" className="space-y-6">
          <ProductGrid 
            products={newProducts} 
            emptyMessage="暂无新品商品" 
          />
        </TabsContent>
        
        {/* 热销榜单 */}
        <TabsContent value="hot" className="space-y-6">
          <ProductGrid 
            products={hotProducts} 
            emptyMessage="暂无热销商品" 
          />
        </TabsContent>
      </Tabs>
    </section>
  )
} 