'use client'

import { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"

interface CartSheetProps {
  children: ReactNode
  side?: "left" | "right" | "top" | "bottom"
}

// 默认占位符图片
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxODAiIHk9IjE4MCI+CjxwYXRoIGQ9Ik0yMS4yNSAySDIuNzVDMS43ODM1IDIgMSAyLjc4MzUgMSAzLjc1VjIwLjI1QzEgMjEuMjE2NSAxLjc4MzUgMjIgMi43NSAyMkgyMS4yNUMyMi4yMTY1IDIyIDIzIDIxLjIxNjUgMjMgMjAuMjVWMy43NUMyMyAyLjc4MzUgMjIuMjE2NSAyIDIxLjI1IDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0xNiAxMUMxNyAxMSAxOCAxMCAxOCA5QzE4IDggMTcgNyAxNiA3QzE1IDcgMTQgOCAxNCA5QzE0IDEwIDE1IDExIDE2IDExWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjMgMTZMMTggMTFMMTMgMTZIMjNaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xIDIyTDYgMTdMMTEgMjJIMVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjwvc3ZnPgo='

export function CartSheet({ children, side = "right" }: CartSheetProps) {
  const { state, updateQuantity, removeItem } = useCart()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side={side} className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-rose-500" />
            <span>购物车</span>
            {state.totalItems > 0 && (
              <Badge variant="secondary" className="ml-2">
                {state.totalItems}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">购物车是空的</h3>
              <p className="text-gray-500 text-sm mb-6">还没有添加任何商品</p>
              <Link href="/categories/all">
                <Button className="bg-rose-500 hover:bg-rose-600">
                  开始购物
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* 购物车商品列表 */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.imageUrl || PLACEHOLDER_IMAGE}
                        alt={item.name}
                        fill
                        className="rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = PLACEHOLDER_IMAGE
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.id}`}>
                        <h4 className="font-medium text-gray-900 text-sm truncate hover:text-rose-500 transition-colors">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-600 mb-2">{item.brand}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-rose-500 font-bold text-sm">¥{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ¥{item.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        {/* 数量控制 */}
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[24px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          小计: ¥{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* 购物车摘要 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-900">商品数量</span>
                  <span className="text-base font-semibold">{state.totalItems} 件</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">总计</span>
                  <span className="text-xl font-bold text-rose-500">
                    ¥{state.totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-2 pt-2">
                  <Link href="/cart" className="block">
                    <Button className="w-full bg-rose-500 hover:bg-rose-600">
                      查看购物车
                    </Button>
                  </Link>
                  <Link href="/checkout" className="block">
                    <Button className="w-full" variant="outline">
                      立即结算
                    </Button>
                  </Link>
                </div>

                {/* 继续购物提示 */}
                <div className="text-center pt-2">
                  <Link href="/categories/all">
                    <Button variant="ghost" className="text-sm text-gray-500 hover:text-rose-500">
                      继续购物
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 