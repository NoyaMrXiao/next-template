"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HomeHero() {
  // bg-gradient-to-br from-gray-900 via-gray-800 to-black
  return (
    <div className="relative h-screen overflow-hidden bg-cover"
      style={{ backgroundImage: "url('/hero.jpg')" }}

    >
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/4 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* 主内容 */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center h-full text-center">
          <div className="max-w-4xl space-y-8">
            {/* 品牌标识 */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">奢华香氛体验</span>
            </div>

            {/* 主标题 */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-white leading-tight">
              探索香氛的
              <br />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-extralight">
                奇妙世界
              </span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl sm:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              发现独特的香氛体验，让每一个瞬间都充满诗意与优雅
            </p>

            {/* 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 border-0 px-8 py-3 text-base font-medium rounded-full transition-all duration-300 hover:scale-105"
                >
                  立即探索
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories/all">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 px-8 py-3 text-base font-medium rounded-full transition-all duration-300 hover:scale-105"
                >
                  浏览系列
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>

      {/* 滚动指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
} 