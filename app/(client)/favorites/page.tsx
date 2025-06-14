"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/lib/favorites-context"
import { useCart } from "@/lib/cart-context"
import toast from 'react-hot-toast'

export default function FavoritesPage() {
  const { state: favoritesState, removeItem, clearFavorites } = useFavorites()
  const { addItem: addToCart } = useCart()

  const handleAddToCart = (item: any) => {
    if (!item.inStock) {
      toast.error('商品暂时缺货')
      return
    }

    addToCart({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice,
      imageUrl: item.imageUrl,
      inStock: item.inStock
    })
    
    toast.success('已添加到购物车')
  }

  const handleRemoveFromFavorites = (id: string) => {
    removeItem(id)
    toast.success('已从收藏夹移除')
  }

  if (favoritesState.items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-8">
              <Heart className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">收藏夹空空如也</h1>
            <p className="text-gray-600 mb-8">
              还没有收藏任何商品，快去探索我们的精选商品吧！
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

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">我的收藏</h1>
            <p className="text-gray-600">已收藏 {favoritesState.totalItems} 件商品</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/categories/all">
              <Button variant="ghost" className="text-gray-600">
                继续购物
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={clearFavorites}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清空收藏
            </Button>
          </div>
        </div>

        {/* 收藏商品网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoritesState.items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* 商品图片 */}
              <div className="relative aspect-square">
                <Link href={`/products/${item.id}`}>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-700 rounded-full"
                  onClick={() => handleRemoveFromFavorites(item.id)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>

              {/* 商品信息 */}
              <div className="p-4">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-gray-700 transition-colors mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                
                {/* 价格 */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ¥{item.price.toFixed(2)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ¥{item.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* 库存状态 */}
                <div className="mb-3">
                  {item.inStock ? (
                    <span className="text-sm text-green-600">现货</span>
                  ) : (
                    <span className="text-sm text-red-500">暂时缺货</span>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    加入购物车
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveFromFavorites(item.id)}
                    className="text-gray-600 hover:text-red-500 border-gray-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部推荐 */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">继续探索</h2>
          <p className="text-gray-600 mb-8">发现更多精选商品</p>
          <Link href="/categories/all">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
              浏览全部商品
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 