 "use client"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const newProducts = [
  {
    id: "1",
    name: "Chanel No.5 香精",
    brand: "Chanel",
    price: 1299,
    originalPrice: 1599,
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 2847,
    tags: ["经典", "法式", "优雅"],
    badge: {
      text: "热销",
      variant: "destructive" as const
    },
    inStock: true,
    category: '香水',
    subcategory: '香水',
    isNew: true,
    isHot: false
  },
  // ... 更多新品
]

export default function NewProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900">新品上市</h1>
          <p className="mt-2 text-gray-600">探索最新上市的香氛产品</p>
        </div>
      </div>

      {/* 产品列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              viewMode="grid"
            />
          ))}
        </div>
      </div>
    </div>
  )
}