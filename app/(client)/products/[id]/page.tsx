import Link from "next/link"
import { ProductDetailClient } from "@/components/product-detail-client"
import { RelatedProducts } from "@/components/ui/related-products"
import { getProductDetail, getRelatedProducts } from "@/actions/product-detail"
import { notFound } from 'next/navigation'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log(id)
  const productId = parseInt(id)

  // 验证ID是否为有效数字
  if (isNaN(productId)) {
    notFound()
  }

  // 并行获取商品详情和相关商品
  const [productResult, relatedProductsResult] = await Promise.all([
    getProductDetail(productId),
    getRelatedProducts(productId, 8)
  ])

  // 如果商品不存在，显示404页面
  if (!productResult.success || !productResult.data) {
    notFound()
  }

  const product = productResult.data
  const relatedProducts = relatedProductsResult.success ? relatedProductsResult.data || [] : []

  return (
    <div className="min-h-screen">
      {/* 面包屑导航 */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/categories/all" className="hover:text-gray-900 transition-colors">All Categories</Link>
            <span>/</span>
            <Link 
              href={`/categories/all?category=${encodeURIComponent(product.name)}`} 
              className="hover:text-gray-900 transition-colors"
            >
              {product.name}
            </Link>
            {product.subcategoryId && (
              <>
                <span>/</span>
                <Link 
                    href={`/categories/all?category=${encodeURIComponent(product.name)}&subcategory=${encodeURIComponent(product.name)}`}
                  className="hover:text-gray-900 transition-colors"
                >
                  {product.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailClient product={product} />
      </div>

      {/* 相关产品推荐 */}
      {relatedProducts.length > 0 && (
        <RelatedProducts currentProduct={product} relatedProducts={relatedProducts} />
      )}
    </div>
  )
}