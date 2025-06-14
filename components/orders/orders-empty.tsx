import Link from "next/link"
import { Package, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OrdersEmpty() {
  return (
    <div className="relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-rose-50/30 to-purple-50/30 rounded-3xl -z-10" />
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl -z-10" />
      
      <div className="relative text-center py-20 px-8">
        {/* 图标区域 */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-lg">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
          
          {/* 装饰性小图标 */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-pulse delay-500">
            <ShoppingBag className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* 文本内容 */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3">
            暂无订单
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            您还没有任何订单记录
            <br />
            快去探索我们精选的香氛产品吧！
          </p>
        </div>

        {/* 行动按钮 */}
        <div className="space-y-4">
          <Link href="/categories/all">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full px-8"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              开始购物
            </Button>
          </Link>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"></div>
              <span>精选香氛</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
              <span>品质保证</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
              <span>快速配送</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 