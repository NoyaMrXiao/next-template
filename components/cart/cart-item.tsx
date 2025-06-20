import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItem as CartItemType } from "@/lib/cart-context"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center py-6 border-b border-gray-100">
      {/* 商品信息 */}
      <div className="col-span-5 flex items-center space-x-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/products/${item.id}`}>
            <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors">
              {item.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
        </div>
      </div>

      {/* 价格 */}
      <div className="col-span-2 text-center">
        <span className="text-lg font-medium text-gray-900">
          ¥{item.price.toFixed(2)}
        </span>
      </div>

      {/* 数量控制 */}
      <div className="col-span-2 flex items-center justify-center">
        <div className="flex items-center border border-gray-200 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="h-8 w-8 p-0 hover:bg-gray-50 disabled:opacity-50"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="px-3 py-1 min-w-[40px] text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="h-8 w-8 p-0 hover:bg-gray-50"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* 小计 */}
      <div className="col-span-2 text-center">
        <span className="text-lg font-medium text-gray-900">
          ¥{(item.price * item.quantity).toFixed(2)}
        </span>
      </div>

      {/* 删除按钮 */}
      <div className="col-span-1 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveItem(item.id)}
          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
} 