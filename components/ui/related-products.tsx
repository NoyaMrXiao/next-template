'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { IProductDetail } from "@/actions/product-detail"

interface RelatedProductsProps {
  currentProduct: IProductDetail
  relatedProducts: IProductDetail[]
}

// 主要的相关产品推荐组件
export function RelatedProducts({ currentProduct, relatedProducts }: RelatedProductsProps) {
  if (relatedProducts.length === 0) {
    return null
  }

  // 转换产品数据格式以匹配ProductCard组件的接口
  const convertToProductWithDetails = (product: IProductDetail) => ({
    id: product.id.toString(),
    name: product.name,
    brand: product.brand || '',
    price: product.price,
    originalPrice: product.originalPrice || undefined,
    imageUrl: product.images[0] || '',
    inStock: product.stock > 0,
    stock: product.stock,
    category: product.name,
    subcategory: product.name,
  })

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Related Products</h2>
          <p className="text-sm text-gray-600">
            Similar items you might like
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={convertToProductWithDetails(product)}
              viewMode="grid"
            />
          ))}
        </div>
        
        {/* 查看更多按钮 */}
        <div className="text-center mt-12">
          <Link href={`/categories/all?category=${encodeURIComponent(currentProduct.name)}`}>
            <Button variant="outline" className="px-6 py-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-sm">
              View More {currentProduct.name}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 