"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, Minus, Plus, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { CartSheet } from "@/components/cart-sheet"
import { cn } from "@/lib/utils"
import toast from 'react-hot-toast'

interface ProductDetailClientProps {
  product: any
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const isProductFavorite = isFavorite(product.id.toString())

  // 默认占位符图片
  const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxODAiIHk9IjE4MCI+CjxwYXRoIGQ9Ik0yMS4yNSAySDIuNzVDMS43ODM1IDIgMSAyLjc4MzUgMSAzLjc1VjIwLjI1QzEgMjEuMjE2NSAxLjc4MzUgMjIgMi43NSAyMkgyMS4yNUMyMi4yMTY1IDIyIDIzIDIxLjIxNjUgMjMgMjAuMjVWMy43NUMyMyAyLjc4MzUgMjIuMjE2NSAyIDIxLjI1IDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0xNiAxMUMxNyAxMSAxOCAxMCAxOCA5QzE4IDggMTcgNyAxNiA3QzE1IDcgMTQgOCAxNCA5QzE0IDEwIDE1IDExIDE2IDExWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjMgMTZMMTggMTFMMTMgMTZIMjNaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xIDIyTDYgMTdMMTEgMjJIMVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjwvc3ZnPgo='

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('商品暂时缺货')
      return
    }

    addItem({
      id: product.id.toString(),
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.images?.[0] || PLACEHOLDER_IMAGE,
      inStock: product.inStock,
      quantity: quantity
    })
    
    setIsAddedToCart(true)
    toast.success('已添加到购物车')
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: product.id.toString(),
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.images?.[0] || PLACEHOLDER_IMAGE,
      inStock: product.inStock
    })
    
    if (isProductFavorite) {
      toast.success('已从收藏夹移除')
    } else {
      toast.success('已添加到收藏夹')
    }
  }

  // 确保images数组存在且不为空
  const productImages = product.images && product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE]
  const currentImage = productImages[selectedImage] || PLACEHOLDER_IMAGE

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* 左侧：商品图片 */}
      <div className="space-y-4">
        <div className="aspect-square relative overflow-hidden bg-white border border-gray-100">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = PLACEHOLDER_IMAGE
            }}
          />
        </div>
        {/* 缩略图 */}
        {productImages.length > 1 && (
          <div className="flex space-x-2">
            {productImages.map((image: string, index: number) => (
              <button
                key={index}
                className={cn(
                  "w-16 h-16 overflow-hidden border transition-colors",
                  selectedImage === index ? "border-gray-900" : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || PLACEHOLDER_IMAGE}
                  alt={`${product.name} ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = PLACEHOLDER_IMAGE
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 右侧：商品信息 */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-600">{product.brand}</p>
        </div>

        {/* 价格 */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-gray-900">¥{product.price}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">¥{product.originalPrice}</span>
          )}
        </div>

        {/* 商品描述 */}
        <div className="py-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Accordion 展示产品特点和规格 */}
        <div className="border-t border-gray-200">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="features" className="border-none">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">产品特点</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {product.features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specifications" className="border-none">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">产品规格</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2">
                  {product.specifications?.map((spec: any, index: number) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-gray-600">{spec.name}</span>
                      <span className="text-sm font-medium text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* 数量选择 */}
        <div className="flex items-center space-x-4 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-700">数量</span>
          <div className="flex items-center border border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="h-8 w-8 p-0 hover:bg-gray-50 disabled:opacity-50"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="px-3 py-1 min-w-[40px] text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
              className="h-8 w-8 p-0 hover:bg-gray-50"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-3">
          <CartSheet>
            <Button 
              className="flex-1 bg-black hover:bg-gray-800 text-white disabled:bg-gray-300"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {isAddedToCart ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  已添加
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? '加入购物车' : '暂时缺货'}
                </>
              )}
            </Button>
          </CartSheet>
          <Button 
            variant="outline" 
            size="icon" 
            className={`border-gray-200 hover:bg-gray-50 ${
              isProductFavorite 
                ? 'text-red-500 hover:text-red-600 bg-red-50 border-red-200' 
                : 'hover:text-red-500'
            }`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`w-4 h-4 ${isProductFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" className="border-gray-200 hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* 库存状态 */}
        <div className="text-sm">
          {product.inStock ? (
            <span className="text-green-600">✓ 现货供应</span>
          ) : (
            <span className="text-red-500">✗ 暂时缺货</span>
          )}
        </div>
      </div>
    </div>
  )
} 