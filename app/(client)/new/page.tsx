"use client"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const newProducts = [
  {
    id: "1",
    name: "Chanel No.5 香精",
    brand: "Chanel",
    price: 1299,
    originalPrice: 1599,
    imageUrl: "https://odebusiness.oss-cn-beijing.aliyuncs.com/images/jo_sku_LGX001_1000x1000_2.jpeg",
    rating: 4.8,
    reviewCount: 2847,
    tags: ["经典", "法式", "优雅"],
    badge: {
      text: "热销",
      variant: "destructive" as const
    },
    inStock: true,
    stock: 50,
    category: '香水',
    subcategory: '香水',
    isNew: true,
    isHot: false,
    description: "经典香调，永恒优雅。前调：柑橘清新，中调：茉莉馥郁，后调：广藿香持久。",
    features: [
      "独特的花香调配方",
      "持久留香",
      "优雅的玻璃瓶设计"
    ]
  },
]

export default function NewProductsPage() {
  return (
    <div className="min-h-screen">
      {/* 顶部横幅 */}
      <div className="relative h-[480px] w-full overflow-hidden">
        <Image
          src="/hero-bg.webp"
          alt="新品上市"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl font-light mb-6">全新香氛系列</h1>
            <p className="text-lg md:text-xl font-light mb-8 leading-relaxed">
              探索全新香调，感受独特魅力
            </p>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors rounded-none px-8 py-6"
            >
              立即探索
            </Button>
          </div>
        </div>
      </div>

      {/* 产品展示区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* 区域标题 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-4">全新上市</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            精选全新香氛，为您带来前所未有的感官体验。每一款香水都诉说着独特的故事，等待您的发现。
          </p>
        </div>

        {/* 产品网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {newProducts.map((product) => (
            <div key={product.id} className="flex flex-col">
              <ProductCard 
                product={product}
                viewMode="grid"
              />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-500">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部区域 */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-light text-gray-900 mb-4">探索更多</h3>
            <p className="text-gray-600 mb-8">
              发现我们的限量系列和独家优惠
            </p>
            <Button 
              variant="outline"
              className="rounded-none border-black text-black hover:bg-black hover:text-white transition-colors px-8 py-6"
            >
              查看全部系列
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}