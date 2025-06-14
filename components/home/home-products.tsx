import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"

interface HomeProductsProps {
  featuredProducts: any[]
  newProducts: any[]
  hotProducts: any[]
}

export function HomeProducts({ 
  featuredProducts, 
  newProducts, 
  hotProducts
}: HomeProductsProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Tabs defaultValue="featured" className="space-y-6">
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
        
        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  viewMode="grid"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">暂无精选商品</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.length > 0 ? (
              newProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  viewMode="grid"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">暂无新品商品</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="hot" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotProducts.length > 0 ? (
              hotProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  viewMode="grid"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">暂无热销商品</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
} 