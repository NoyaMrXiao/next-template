import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyCart() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-8">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">购物车空空如也</h1>
          <p className="text-gray-600 mb-8">
            还没有添加任何商品，快去探索我们的精选商品吧！
          </p>
          <Link href="/categories/all">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
              开始购物
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 