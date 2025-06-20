import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryGrid } from "@/components/ui/category-grid"
import { ArrowRight, Sparkles } from "lucide-react"
import type { Category } from "@/lib/types"

interface HomeCategoriesProps {
  categories: Category[]
}

export function HomeCategories({ categories }: HomeCategoriesProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700 text-sm font-medium">精选系列</span>
        </div>
        
        <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
          探索香氛
          <span className="font-normal text-gray-700">分类</span>
        </h2>
        
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          每一个系列都承载着独特的故事，等待您去发现和体验
        </p>
      </div>

      {/* 分类网格 */}
      <div className="mb-12">
        <CategoryGrid categories={categories} />
      </div>

      {/* 查看全部按钮 */}
      <div className="text-center">
        <Link href="/categories/all">
          <Button 
            variant="outline" 
            size="lg"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
          >
            查看全部分类
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* 装饰元素 */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gray-100 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-60 -z-10"></div>
    </section>
  )
} 