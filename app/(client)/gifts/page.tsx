"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gift } from "lucide-react"

const giftSets = [
  {
    id: "1",
    name: "法式香氛礼盒",
    description: "精选法国顶级香氛品牌，打造完美礼物",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
    price: 2999,
    originalPrice: 3999,
    includes: ["Chanel No.5 香精", "Diptyque 香薰蜡烛", "Jo Malone 身体乳"]
  },
  {
    id: "2",
    name: "东方香调礼盒",
    description: "融合东方香调，展现独特魅力",
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=300&fit=crop",
    price: 2599,
    originalPrice: 3299,
    includes: ["Tom Ford 乌木沉香", "Le Labo 檀香", "Byredo 东方调香水"]
  },
  // ... 更多礼盒
]

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-rose-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">礼盒套装</h1>
              <p className="mt-2 text-gray-600">精心搭配的香氛礼盒，传递美好心意</p>
            </div>
          </div>
        </div>
      </div>

      {/* 礼盒列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftSets.map((gift) => (
            <Card key={gift.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={gift.imageUrl}
                  alt={gift.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{gift.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/80 text-sm">¥{gift.price}</span>
                    <span className="text-white/60 text-sm line-through">¥{gift.originalPrice}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-gray-600 text-sm">{gift.description}</p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">礼盒包含：</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {gift.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white">
                  立即购买
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