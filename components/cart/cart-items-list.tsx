import { CartItem as CartItemType } from "@/lib/cart-context"
import { CartItem } from "./cart-item"

interface CartItemsListProps {
  items: CartItemType[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

export function CartItemsList({ items, onUpdateQuantity, onRemoveItem }: CartItemsListProps) {
  return (
    <div className="xl:col-span-3">
      {/* 表格头部 */}
      <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 mb-6">
        <div className="col-span-5 text-sm font-medium text-gray-700 uppercase tracking-wider">
          Product
        </div>
        <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wider text-center">
          Price
        </div>
        <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wider text-center">
          Quantity
        </div>
        <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wider text-center">
          Total
        </div>
        <div className="col-span-1 text-sm font-medium text-gray-700 uppercase tracking-wider text-center">
          {/* 删除操作占位 */}
        </div>
      </div>

      {/* 商品列表 */}
      <div className="space-y-8">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  )
} 