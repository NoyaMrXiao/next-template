import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartHeaderProps {
  onClearCart: () => void
}

export function CartHeader({ onClearCart }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-12">
      <h1 className="text-4xl font-bold text-gray-900">购物车</h1>
      <div className="flex items-center space-x-4">
        <Link href="/categories/all">
          <Button variant="ghost" className="text-gray-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            继续购物
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={onClearCart}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          清空
        </Button>
      </div>
    </div>
  )
} 