import Link from "next/link"
import { ArrowLeft, Package, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrdersHeaderProps {
  ordersCount: number
}

export function OrdersHeader({ ordersCount }: OrdersHeaderProps) {
  return (
    <div className="relative mb-12">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-3xl -z-10" />
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-2xl -z-10" />
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-2xl -z-10" />
      
      <div className="relative p-8">
        {/* 导航和标题 */}
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              我的订单
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {ordersCount > 0 ? `共 ${ordersCount} 个订单` : '查看您的订单状态和配送信息'}
            </p>
          </div>
        </div>

        {/* 订单统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">待支付</p>
                <p className="text-xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">待发货</p>
                <p className="text-xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">已完成</p>
                <p className="text-xl font-bold text-gray-900">{ordersCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 