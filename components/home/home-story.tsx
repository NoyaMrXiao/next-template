import { Button } from "@/components/ui/button"
import { ArrowRight, Quote, Sparkles } from "lucide-react"
import Link from "next/link"

export function HomeStory() {
  return (
    <section className="py-16 bg-primary  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 左侧文字内容 */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 text-sm font-medium">品牌故事</span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-light text-gray-900 leading-tight">
                香氛的
                <br />
                <span className="font-normal text-gray-700">艺术哲学</span>
              </h2>
              
              <div className="relative">
                <Quote className="absolute -top-2 -left-4 w-8 h-8 text-gray-300" />
                <p className="text-gray-600 text-lg leading-relaxed pl-8">
                  我们深信，每一种香氛都承载着独特的情感与记忆。从法式的优雅到东方的神秘，
                  从清新的花香到温暖的木质调，我们精心甄选每一款香氛产品。
                </p>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                让香氛成为您表达个性、营造氛围的完美伴侣，在您的生活中留下美好的嗅觉印记，
                每一次呼吸都是一场诗意的邂逅。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/story">
                <Button className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-full font-medium">
                  了解更多故事
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-full font-medium">
                  探索香氛
                </Button>
              </Link>
            </div>
          </div>
          
          {/* 右侧视觉元素 */}
          <div className="relative">
            <div className="aspect-square max-w-lg mx-auto">
              {/* 主要装饰圆环 */}
              <div className="relative w-full h-full">
                <div className="absolute inset-0 border border-gray-200 rounded-full"></div>
                <div className="absolute inset-8 border border-gray-300 rounded-full"></div>
                <div className="absolute inset-16 border border-gray-400 rounded-full"></div>
                
                {/* 中心内容 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">香氛艺术</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      每一款香氛都是<br />
                      艺术与科学的完美结合
                    </p>
                  </div>
                </div>
                
                {/* 装饰小圆点 */}
                <div className="absolute top-8 right-8 w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-500"></div>
                <div className="absolute top-1/3 left-4 w-2 h-2 bg-gray-200 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
            
            {/* 背景装饰 */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gray-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-60 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 