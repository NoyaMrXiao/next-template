'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Package,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  MoreVertical
} from 'lucide-react'
import EditProductDialog from './edit-product-dialog'
import {
  getProducts,
  batchUpdateProductStatus,
  batchDeleteProducts,
  type ProductQueryParams
} from '@/actions/product'
import { useToast } from '@/hooks/use-toast'

interface AdminProduct {
  id: number
  name: string
  brand: string | null
  sku: string
  price: number
  originalPrice: number | null
  stock: number
  images: string[]
  isActive: boolean
  isFeatured: boolean
  category: {
    id: number
    name: string
  }
  subcategory: {
    id: number
    name: string
  } | null
  description?: string | null
  volume?: string | null
  categoryId: number
  subcategoryId?: number | null
  createdAt: string
  updatedAt: string
}

export function ProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const { toast } = useToast()

  // 获取商品数据
  const fetchProducts = async (params: ProductQueryParams = {}) => {
    try {
      setLoading(true)
      const queryParams = {
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
        isActive: filterStatus === 'all' ? undefined : filterStatus === 'active',
        ...params
      }

      const result = await getProducts(queryParams)

      if (result.success && result.data) {
        // 转换数据类型以匹配接口
        const convertedProducts: AdminProduct[] = result.data.products.map((product: AdminProduct) => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          sku: product.sku,
          price: Number(product.price),
          originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
          stock: product.stock,
          images: product.images,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          category: {
            id: product.category.id,
            name: product.category.name
          },
          subcategory: product.subcategory ? {
            id: product.subcategory.id,
            name: product.subcategory.name
          } : null,
          description: product.description || undefined,
          volume: product.volume || undefined,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId || undefined,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }))

        setProducts(convertedProducts)
        setTotalPages(result.data.pagination.totalPages)
        setTotal(result.data.pagination.total)
      } else {
        toast({
          title: "获取商品失败",
          description: result.error || "请稍后重试",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('获取商品失败:', error)
      toast({
        title: "获取商品失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // 初始加载和搜索/筛选变化时重新加载
  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm, filterStatus])

  // 切换商品状态
  const toggleProductStatus = async (productId: number, isActive: boolean) => {
    try {
      const result = await batchUpdateProductStatus([productId], !isActive)

      if (result.success) {
        toast({
          title: "操作成功",
          description: result.message
        })
        // 重新获取数据
        fetchProducts()
      } else {
        toast({
          title: "操作失败",
          description: result.error || "请稍后重试",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('切换商品状态失败:', error)
      toast({
        title: "操作失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      })
    }
  }

  // 批量操作
  const handleBatchOperation = async (operation: 'activate' | 'deactivate' | 'delete') => {
    if (selectedProducts.length === 0) {
      toast({
        title: "请选择商品",
        description: "请先选择要操作的商品",
        variant: "destructive"
      })
      return
    }

    try {
      let result

      if (operation === 'delete') {
        if (!confirm(`确定要删除选中的 ${selectedProducts.length} 个商品吗？此操作不可恢复。`)) {
          return
        }
        result = await batchDeleteProducts(selectedProducts)
      } else {
        const isActive = operation === 'activate'
        result = await batchUpdateProductStatus(selectedProducts, isActive)
      }

      if (result.success) {
        toast({
          title: "操作成功",
          description: result.message
        })
        setSelectedProducts([])
        // 重新获取数据
        fetchProducts()
      } else {
        toast({
          title: "操作失败",
          description: result.error || "请稍后重试",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('批量操作失败:', error)
      toast({
        title: "操作失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      })
    }
  }

  // 商品更新回调
  const handleProductUpdate = () => {
    fetchProducts()
    toast({
      title: "商品更新成功",
      description: "商品信息已更新"
    })
  }

  // 选择商品
  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // 重置到第一页
  }

  // 筛选处理
  const handleFilterChange = (status: 'all' | 'active' | 'inactive') => {
    setFilterStatus(status)
    setCurrentPage(1) // 重置到第一页
  }

  if (loading && products.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>加载中...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* 操作栏 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索商品名称、SKU或品牌..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                状态筛选
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleFilterChange('all')}>
                全部
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('active')}>
                已上架
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('inactive')}>
                已下架
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => fetchProducts()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            刷新
          </Button>

          {selectedProducts.length > 0 && (
            <>
              <Button
                onClick={() => handleBatchOperation('activate')}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                批量上架 ({selectedProducts.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBatchOperation('deactivate')}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                批量下架 ({selectedProducts.length})
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleBatchOperation('delete')}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                批量删除 ({selectedProducts.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 商品表格 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="w-12 p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="w-16 p-4 text-left">图片</th>
                  <th className="p-4 text-left">商品信息</th>
                  <th className="p-4 text-left">品牌</th>
                  <th className="p-4 text-left">分类</th>
                  <th className="p-4 text-left">价格</th>
                  <th className="p-4 text-left">库存</th>
                  <th className="p-4 text-left">状态</th>
                  <th className="p-4 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </div>
                        {product.volume && (
                          <div className="text-sm text-gray-500">
                            规格: {product.volume}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{product.brand || '无'}</span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-sm">{product.category.name}</div>
                        {product.subcategory && (
                          <div className="text-xs text-gray-500">
                            {product.subcategory.name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="font-medium">¥{product.price}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-400 line-through">
                            ¥{product.originalPrice}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${product.stock === 0
                          ? 'text-red-600'
                          : product.stock <= 10
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? '已上架' : '已下架'}
                        </Badge>
                        {product.isFeatured && (
                          <Badge variant="outline" className="text-xs">精选</Badge>
                        )}
                        {product.stock === 0 && (
                          <Badge variant="destructive" className="text-xs">缺货</Badge>
                        )}
                        {product.stock > 0 && product.stock <= 10 && (
                          <Badge variant="secondary" className="text-xs">库存不足</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={product.isActive ? "outline" : "default"}
                          onClick={() => toggleProductStatus(product.id, product.isActive)}
                          disabled={product.stock === 0 && !product.isActive}
                        >
                          {product.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <EditProductDialog
                          product={{
                            ...product,
                            volume: product.volume || undefined,
                            description: product.description || undefined,
                            subcategoryId: product.subcategoryId || undefined
                          }}
                          onProductUpdate={handleProductUpdate}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            共 {total} 个商品，第 {currentPage} / {totalPages} 页
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无商品</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all'
              ? '没有找到符合条件的商品'
              : '还没有添加任何商品'}
          </p>
        </div>
      )}
    </div>
  )
} 