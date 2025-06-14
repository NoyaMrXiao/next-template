"use client"

import { Button } from "./button"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  title: string
  description: string
  imageUrl: string
}

export function HeroSection({ title, description, imageUrl }: HeroSectionProps) {
  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* 背景图片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
      </div>

      {/* 内容 */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white">
                立即探索
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                了解更多
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 装饰元素 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent" />
    </div>
  )
}