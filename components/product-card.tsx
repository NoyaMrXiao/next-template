'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'
import { formatPrice, formatDiscount, cn } from '@/lib/utils'
import { TOAST_CONFIG } from '@/lib/constants'
import type { Product, ViewMode } from '@/lib/types'
import { Button } from '@/components/ui/button'

// ===========================================
// 类型定义
// ===========================================

interface ProductCardProps {
  product: Product
  viewMode?: ViewMode
  showBadges?: boolean
  showRating?: boolean
  className?: string
}

/**
 * 产品价格组件
 */
function ProductPrice({ price, originalPrice }: { price: number; originalPrice?: number }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-base font-medium text-gray-900">
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-gray-500 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  )
}

// ===========================================
// 主组件
// ===========================================

/**
 * 产品卡片组件
 */
export function ProductCard({
  product,
  viewMode = 'grid',
  showBadges = true,
  showRating = true,
  className
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const isProductFavorite = isFavorite(product.id)

  // 处理加入购物车
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.inStock) {
      toast.error('商品暂时缺货', { style: TOAST_CONFIG.STYLES.ERROR })
      return
    }

    if (isAddingToCart) return

    setIsAddingToCart(true)

    try {
      addItem({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        quantity: 1,
        inStock: product.inStock
      })

      toast.success('已添加到购物车', { style: TOAST_CONFIG.STYLES.SUCCESS })
    } catch (error) {
      console.error('添加到购物车失败:', error)
      toast.error('添加失败，请重试', { style: TOAST_CONFIG.STYLES.ERROR })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // 处理收藏切换
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      toggleFavorite({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        inStock: product.inStock
      })

      const message = isProductFavorite ? '已从收藏夹移除' : '已添加到收藏夹'
      toast.success(message, { style: TOAST_CONFIG.STYLES.SUCCESS })
    } catch (error) {
      console.error('收藏操作失败:', error)
      toast.error('操作失败，请重试', { style: TOAST_CONFIG.STYLES.ERROR })
    }
  }

  // 列表视图渲染
  if (viewMode === 'list') {
    return (
      <article
        className={cn(
          "border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm",
          className
        )}
      >
        <div className="flex p-6 gap-6">
          {/* 产品图片 */}
          <Link href={`/products/${product.id}`} className="relative hover:scale-105 transition-all duration-200 w-24 h-24 flex-shrink-0 group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-opacity duration-200 group-hover:opacity-90",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsImageLoading(false)}
              sizes="96px"
            />
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
          </Link>

          {/* 产品信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 space-y-1">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
              </div>

              {/* 操作区域 */}
              <div className="flex items-center gap-3 ml-4">
                <ProductPrice price={product.price} originalPrice={product.originalPrice} />

                <button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "transition-colors",
                    isProductFavorite
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                  aria-label={isProductFavorite ? "取消收藏" : "添加收藏"}
                >
                  <Heart className={cn("w-4 h-4", isProductFavorite && "fill-current")} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    )
  }

  // 网格视图渲染
  return (
    <article
      className={cn(
        " transition-all  duration-300 ",
        className
      )}
    >
      {/* 产品图片区域 */}
      <Link href={`/products/${product.id}`} className="block group relative aspect-square overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-all duration-300 group-hover:scale-105",
            isImageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsImageLoading(false)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* 加载状态 */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}

        {/* 收藏按钮 */}
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-2 hidden group-hover:block right-2 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm",
            isProductFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 hover:text-gray-600"
          )}
          aria-label={isProductFavorite ? "取消收藏" : "添加收藏"}
        >
          <Heart className={cn("w-4 h-4", isProductFavorite && "fill-current")} />
        </button>
      </Link>

      {/* 产品信息区域 */}
      <div className="pt-6 pb-4 text-center space-y-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-medium text-gray-900 hover:text-gray-700 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>


        <div className="flex items-center justify-center pt-2">
          <ProductPrice price={product.price} originalPrice={product.originalPrice} />
        </div>

        {/* 加入购物车按钮 */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className="w-auto  mt-4 text-black/90 rounded-none"
          variant="outline"
        >
          {isAddingToCart ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : product.inStock ? (
            '加入购物车'
          ) : (
            '暂时缺货'
          )}
        </Button>
      </div>
    </article>
  )
}