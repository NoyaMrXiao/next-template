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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IProductDetail } from "@/actions/product-detail"

interface ProductDetailClientProps {
  product: IProductDetail
}

// 默认占位符图片
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxODAiIHk9IjE4MCI+CjxwYXRoIGQ9Ik0yMS4yNSAySDIuNzVDMS43ODM1IDIgMSAyLjc4MzUgMSAzLjc1VjIwLjI1QzEgMjEuMjE2NSAxLjc4MzUgMjIgMi43NSAyMkgyMS4yNUMyMi4yMTY1IDIyIDIzIDIxLjIxNjUgMjMgMjAuMjVWMy43NUMyMyAyLjc4MzUgMjIuMjE2NSAyIDIxLjI1IDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMS41IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0xNiAxMUMxNyAxMSAxOCAxMCAxOCA5QzE4IDggMTcgNyAxNiA3QzE1IDcgMTQgOCAxNCA5QzE0IDEwIDE1IDExIDE2IDExWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjMgMTZMMTggMTFMMTMgMTZIMjNaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xIDIyTDYgMTdMMTEgMjJIMVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjwvc3ZnPgo='

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState(product?.images?.[0] || null)
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || PLACEHOLDER_IMAGE)
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const isProductFavorite = isFavorite(product.id.toString())
  console.log(product)  // 打印产品信息

  const handleAddToCart = () => {
    if (!product.stock) {
      toast.error('商品暂时缺货')
      return
    }

    addItem({
      id: product.id.toString(),
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      originalPrice: product.originalPrice || 0,
      imageUrl: product.images?.[0] || PLACEHOLDER_IMAGE,
      inStock: product.stock > 0,
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
      originalPrice: product.originalPrice || 0,
      imageUrl: product.images?.[0] || PLACEHOLDER_IMAGE,
      inStock: product.stock > 0
    })
    
    if (isProductFavorite) {
      toast.success('已从收藏夹移除')
    } else {
      toast.success('已添加到收藏夹')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 产品导航路径 */}
      <div className="text-sm text-gray-500 mb-8">
        <span>主页</span>
        <span className="mx-2">/</span>
        <span>香水</span>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 左侧图片展示 */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={cn(
                  "relative aspect-square overflow-hidden",
                  selectedImage === image && "ring-2 ring-black"
                )}
              >
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 右侧产品信息 */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-light mb-2">{product.name}</h1>
              <p className="text-xl text-gray-500 font-light">{product.brand}</p>
          </div>

          {/* 产品描述 */}
          <div className="space-y-4">
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>

          {/* 规格选择 */}
          <div>
            <h3 className="text-sm font-medium mb-4">选择规格</h3>
            {/* <div className="flex gap-4">
              {product.sizes.map((size: any) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "px-6 py-3 border text-sm",
                    selectedSize?.id === size.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-black"
                  )}
                >
                  {size.name}
                </button>
              ))}
            </div> */}
          </div>

          {/* 价格和购买按钮 */}
          <div className="space-y-4">
            <div className="text-2xl">¥{product.price}</div>
            <Button className="w-full h-12 text-base rounded-none">
              加入购物车
            </Button>
          </div>

          {/* 产品特点 */}
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">香调</TabsTrigger>
              <TabsTrigger value="ingredients">成分</TabsTrigger>
              <TabsTrigger value="delivery">配送</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="space-y-4 pt-4">
              {product.tags.map((tag: string, index: number) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium">{tag}</h4>
                  <p className="text-gray-600">{tag}</p>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="ingredients" className="pt-4">
              <p className="text-gray-600">{product.tags}</p>
            </TabsContent>
            <TabsContent value="delivery" className="space-y-4 pt-4">
              <div>
                <h4 className="font-medium mb-2">全场免运费</h4>
                <p className="text-gray-600">所有订单将以最快捷安全的运送方式送到客户手中。</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">礼品包装</h4>
                <p className="text-gray-600">所有的订单都将会以祖·玛珑经典乳白色包装盒，交织黑色罗缎蝴蝶结来包装。</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 