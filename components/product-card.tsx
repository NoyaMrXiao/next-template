'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { ProductWithDetails } from '@/actions/categories-page'
import { useCart } from '@/lib/cart-context'
import { useFavorites } from '@/lib/favorites-context'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: ProductWithDetails
  viewMode: 'grid' | 'list'
}

export function ProductCard({ 
  product, 
  viewMode
}: ProductCardProps) {
  const { addItem } = useCart()
  const { toggleFavorite, isFavorite } = useFavorites()
  const isProductFavorite = isFavorite(product.id)

  // 处理加入购物车
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.inStock) {
      toast.error('商品暂时缺货')
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      inStock: product.inStock
    })
    
    toast.success('已添加到购物车')
  }

  // 处理收藏
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    toggleFavorite({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      inStock: product.inStock
    })
    
    if (isProductFavorite) {
      toast.success('已从收藏夹移除')
    } else {
      toast.success('已添加到收藏夹')
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-100 hover:border-gray-200 transition-colors">
        <div className="flex p-6 gap-6">
          <Link href={`/products/${product.id}`} className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors truncate">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    ¥{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through ml-2">
                      ¥{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <button 
                  onClick={handleToggleFavorite}
                  className={`transition-colors ${
                    isProductFavorite 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isProductFavorite ? 'fill-current' : ''}`} />
                </button>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="bg-black text-white px-3 py-1.5 text-xs font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {product.inStock ? '加入购物车' : '暂时缺货'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 hover:border-gray-200 transition-colors group">
      <Link href={`/products/${product.id}`} className="block relative aspect-square">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
        
        <button 
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 transition-colors ${
            isProductFavorite 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isProductFavorite ? 'fill-current' : ''}`} />
        </button>
        
        {/* 悬停时显示的加入购物车按钮 */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-black hover:bg-gray-800 text-white py-2 text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {product.inStock ? '加入购物车' : '暂时缺货'}
          </button>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mb-3">{product.brand}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              ¥{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ¥{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 