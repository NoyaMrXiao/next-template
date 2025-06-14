"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const brands = [
  {
    id: "1",
    name: "Chanel",
    description: "法国奢侈品牌，以优雅和经典著称",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
    productCount: 24
  },
  {
    id: "2",
    name: "Tom Ford",
    description: "现代奢华香氛，独特而富有魅力",
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=300&fit=crop",
    productCount: 18
  },
  // ... 更多品牌
]

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900">品牌专区</h1>
          <p className="mt-2 text-gray-600">探索全球顶级香氛品牌</p>
        </div>
      </div>

      {/* 品牌列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Card key={brand.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={brand.imageUrl}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{brand.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{brand.productCount} 款产品</p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-gray-600 text-sm">{brand.description}</p>
                <Button variant="ghost" className="mt-4 text-rose-500 hover:text-rose-600">
                  查看品牌
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}