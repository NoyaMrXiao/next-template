"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, X, Heart, ShoppingCart, Star, SlidersHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { searchProducts, getHotSearchKeywords, SearchResult } from "@/actions/search"
import { useCart } from "@/lib/cart-context"

interface SearchPageProps { 
  searchParams: {
    q?: string
    category?: string
    page?: string
    sortBy?: string
    sortOrder?: string
    minPrice?: string
    maxPrice?: string
  }
}

// 加载骨架屏组件
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
}

// 商品卡片组件
function ProductCard({ product }: { product: SearchResult['products'][0] }) {
  const { addItem } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      addItem({
        id: product.id.toString(),
        name: product.name,
        brand: product.brand || '',
        price: product.price,
        originalPrice: product.originalPrice || undefined,
        imageUrl: product.images[0] || '/placeholder.jpg',
        inStock: true,
        quantity: 1
      })
      alert('已添加到购物车')
    } catch (error) {
      alert('添加失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-rose-200">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={`/products/${product.id}`}>
            <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-50">
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          
          {/* 折扣标签 */}
          {discountPercentage && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* 精选标签 */}
          {product.isFeatured && (
            <Badge className="absolute top-3 right-3 bg-amber-500 text-white">
              精选
            </Badge>
          )}
          
          {/* 收藏按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 rounded-full"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
          </Button>
        </div>
        
        <div className="p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-gray-900 hover:text-rose-600 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>
          </Link>
          
          {product.brand && (
            <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
          )}
          
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">
                ¥{product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ¥{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isLoading ? '添加中...' : '加购物车'}
            </Button>
          </div>
          
          {/* 评价信息 */}
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-current text-amber-400" />
              <span className="ml-1">4.8</span>
            </div>
            <span className="mx-2">•</span>
            <span>已售 {product._count?.orderItems || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 筛选栏组件
function FilterSidebar({ 
  searchResult, 
  currentFilters, 
  onFilterChange 
}: {
  searchResult: SearchResult
  currentFilters: any
  onFilterChange: (filters: any) => void
}) {
  const [priceRange, setPriceRange] = useState({
    min: currentFilters.minPrice || '',
    max: currentFilters.maxPrice || ''
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">商品分类</h3>
        <div className="space-y-2">
          <button
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              !currentFilters.category || currentFilters.category === 'all'
                ? 'bg-rose-50 text-rose-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onFilterChange({ ...currentFilters, category: 'all' })}
          >
            全部分类
          </button>
          {searchResult.filters.categories.map((category) => (
            <button
              key={category.id}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                currentFilters.category === category.name
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => onFilterChange({ ...currentFilters, category: category.name })}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium text-gray-900 mb-3">价格区间</h3>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="最低价"
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="text-sm"
            />
            <Input
              placeholder="最高价"
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="text-sm"
            />
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => onFilterChange({
              ...currentFilters,
              minPrice: priceRange.min || undefined,
              maxPrice: priceRange.max || undefined
            })}
          >
            应用价格筛选
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium text-gray-900 mb-3">品牌</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {searchResult.filters.brands.slice(0, 10).map((brand) => (
            <button
              key={brand.name}
              className="block w-full text-left px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => onFilterChange({ 
                ...currentFilters, 
                q: `${currentFilters.q || ''} ${brand.name}`.trim()
              })}
            >
              {brand.name} ({brand.count})
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [hotKeywords, setHotKeywords] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [showFilters, setShowFilters] = useState(false)

  const currentFilters = {
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    page: parseInt(searchParams.get('page') || '1'),
    sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
  }

  // 获取搜索结果
  useEffect(() => {
    const fetchSearchResult = async () => {
      setLoading(true)
      try {
        const result = await searchProducts(currentFilters)
        setSearchResult(result)
      } catch (error) {
        console.error('搜索失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResult()
  }, [searchParams])

  // 获取热门搜索词
  useEffect(() => {
    const fetchHotKeywords = async () => {
      try {
        const keywords = await getHotSearchKeywords()
        setHotKeywords(keywords)
      } catch (error) {
        console.error('获取热门搜索词失败:', error)
      }
    }

    if (!currentFilters.q) {
      fetchHotKeywords()
    }
  }, [currentFilters.q])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      updateFilters({ q: searchQuery.trim(), page: 1 })
    }
  }

  const updateFilters = (newFilters: any) => {
    const params = new URLSearchParams()
    
    Object.entries({ ...currentFilters, ...newFilters }).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        params.set(key, String(value))
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        {searchResult && (
          <>
            {/* 搜索结果统计和排序 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">
                  {currentFilters.q && (
                    <>
                      搜索 "<span className="font-medium text-gray-900">{currentFilters.q}</span>" 
                      找到 <span className="font-medium text-gray-900">{searchResult.pagination.totalCount}</span> 个结果
                    </>
                  )}
                  {!currentFilters.q && (
                    <>共 <span className="font-medium text-gray-900">{searchResult.pagination.totalCount}</span> 个商品</>
                  )}
                </p>
                
                {/* 当前筛选标签 */}
                <div className="flex items-center space-x-2">
                  {currentFilters.category && currentFilters.category !== 'all' && (
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <span>{currentFilters.category}</span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilters({ category: 'all' })}
                      />
                    </Badge>
                  )}
                  {(currentFilters.minPrice || currentFilters.maxPrice) && (
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <span>
                        价格: {currentFilters.minPrice || '0'} - {currentFilters.maxPrice || '∞'}
                      </span>
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                      />
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Select 
                  value={`${currentFilters.sortBy}-${currentFilters.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-')
                    updateFilters({ sortBy, sortOrder })
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">最新</SelectItem>
                    <SelectItem value="price-asc">价格从低到高</SelectItem>
                    <SelectItem value="price-desc">价格从高到低</SelectItem>
                    <SelectItem value="name-asc">名称A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 筛选侧边栏 */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium text-gray-900">筛选条件</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <FilterSidebar
                    searchResult={searchResult}
                    currentFilters={currentFilters}
                    onFilterChange={updateFilters}
                  />
                </div>
              </div>

              {/* 商品列表 */}
              <div className="lg:col-span-3">
                {searchResult.products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {searchResult.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {/* 分页 */}
                    {searchResult.pagination.totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2">
                        <Button
                          variant="outline"
                          disabled={searchResult.pagination.currentPage === 1}
                          onClick={() => handlePageChange(searchResult.pagination.currentPage - 1)}
                        >
                          上一页
                        </Button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: Math.min(5, searchResult.pagination.totalPages) }).map((_, i) => {
                            const page = i + 1
                            return (
                              <Button
                                key={page}
                                variant={searchResult.pagination.currentPage === page ? "default" : "outline"}
                                onClick={() => handlePageChange(page)}
                                className="w-10 h-10"
                              >
                                {page}
                              </Button>
                            )
                          })}
                        </div>

                        <Button
                          variant="outline"
                          disabled={searchResult.pagination.currentPage === searchResult.pagination.totalPages}
                          onClick={() => handlePageChange(searchResult.pagination.currentPage + 1)}
                        >
                          下一页
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关商品</h3>
                    <p className="text-gray-500 mb-4">
                      {currentFilters.q ? `没有找到包含 "${currentFilters.q}" 的商品` : '没有找到符合条件的商品'}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">您可以尝试：</p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        <li>• 检查拼写是否正确</li>
                        <li>• 尝试更宽泛的搜索词</li>
                        <li>• 减少筛选条件</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-12 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
} 