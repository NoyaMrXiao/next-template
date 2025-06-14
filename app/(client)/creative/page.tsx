"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Gift, Palette, Mail } from "lucide-react"

const creativeProducts = [
  {
    id: "1",
    name: "香味明信片套装",
    description: "精选12款经典香氛，打造独特的嗅觉明信片",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
    price: 199,
    originalPrice: 299,
    icon: <Mail className="w-6 h-6 text-rose-500" />,
    features: ["12款经典香氛", "可撕式设计", "精美包装"]
  },
  {
    id: "2",
    name: "气味笔记本",
    description: "独特的香氛笔记本，记录美好时光",
    imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=300&fit=crop",
    price: 159,
    originalPrice: 199,
    icon: <BookOpen className="w-6 h-6 text-rose-500" />,
    features: ["优质纸张", "香氛书签", "精美插图"]
  },
  {
    id: "3",
    name: "嗅觉盲盒",
    description: "探索未知的香氛世界，发现惊喜",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    price: 299,
    originalPrice: 399,
    icon: <Gift className="w-6 h-6 text-rose-500" />,
    features: ["随机香氛", "限定款", "收藏价值"]
  },
  {
    id: "4",
    name: "嗅觉涂色书",
    description: "结合视觉与嗅觉的创意体验",
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=300&fit=crop",
    price: 259,
    originalPrice: 329,
    icon: <Palette className="w-6 h-6 text-rose-500" />,
    features: ["香氛颜料", "精美插画", "互动体验"]
  }
]

export default function CreativePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900">香味文创</h1>
          <p className="mt-2 text-gray-600">探索香氛与文创的奇妙结合</p>
        </div>
      </div>

      {/* 产品列表 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creativeProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    {product.icon}
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/80 text-sm">¥{product.price}</span>
                    <span className="text-white/60 text-sm line-through">¥{product.originalPrice}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-gray-600 text-sm">{product.description}</p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">产品特点：</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {feature}
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