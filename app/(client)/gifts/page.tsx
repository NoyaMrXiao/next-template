"use client"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const categories = [
  { id: "all", name: "全部" },
  { id: "gift-sets", name: "礼品套装" },
  { id: "seasonal", name: "节日特选" },
  { id: "corporate", name: "企业礼品" },
  { id: "personal", name: "个人定制" },
]

const priceRanges = [
  { id: "all", name: "全部价格" },
  { id: "0-299", name: "¥0-299" },
  { id: "300-599", name: "¥300-599" },
  { id: "600-999", name: "¥600-999" },
  { id: "1000+", name: "¥1000+" },
]

// 模拟产品数据
const mockProducts = [
  {
    id: "1",
    name: "香氛礼盒套装",
    description: "精选香氛组合，为生活增添一抹芬芳",
    price: 599,
    imageUrl: "/images/香氛.jpg",
    brand: "Aroma Artistry",
    stock: 10,
    inStock: true
  },
  {
    id: "2",
    name: "香薰蜡烛礼盒",
    description: "纯天然大豆蜡，多款香型选择",
    price: 299,
    imageUrl: "/images/蜡烛.jpg",
    brand: "Aroma Artistry",
    stock: 15,
    inStock: true
  },
  {
    id: "3",
    name: "护理套装",
    description: "天然有机护理产品组合",
    price: 899,
    imageUrl: "/images/护理.jpg",
    brand: "Aroma Artistry",
    stock: 8,
    inStock: true
  },
  {
    id: "4",
    name: "香薰机套装",
    description: "智能香薰机与精油组合",
    price: 799,
    imageUrl: "/images/香薰.jpg",
    brand: "Aroma Artistry",
    stock: 12,
    inStock: true
  }
]

export default function GiftsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题部分 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">精选礼品</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          探索我们精心策划的礼品系列，每一件都承载着独特的情感与品味。
          无论是重要节日还是特别时刻，都能找到最适合的礼物选择。
        </p>
      </div>

      {/* 筛选部分 */}
      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">按类别筛选</h3>
              <TabsList className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">价格区间</h3>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <Button
                    key={range.id}
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    {range.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* 产品展示网格 */}
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="h-full"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 礼品定制服务 */}
      <div className="mt-16 bg-muted rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">私人定制服务</h2>
        <p className="text-muted-foreground mb-6">
          我们提供专业的礼品定制服务，可根据您的需求打造独一无二的礼品方案。
          无论是个人纪念还是企业定制，我们都能为您量身定做完美的礼品选择。
        </p>
        <Button size="lg" variant="default">
          咨询定制方案
        </Button>
      </div>
    </div>
  )
}
