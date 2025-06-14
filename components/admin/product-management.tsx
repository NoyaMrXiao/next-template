'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Edit, 
  Package,
  CheckCircle,
  XCircle,
  Save,
  X
} from 'lucide-react'

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
  createdAt: string
  updatedAt: string
  description?: string
  volume?: string
}

// 伪数据
const mockProducts: AdminProduct[] = [
  {
    id: 1,
    name: "Dior Sauvage 旷野男士香水",
    brand: "Dior",
    sku: "DIOR-SAU-100",
    price: 899,
    originalPrice: 1099,
    stock: 25,
    images: ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400"],
    isActive: true,
    isFeatured: true,
    category: { id: 1, name: "香水类" },
    subcategory: { id: 1, name: "淡香精（Eau de Parfum）" },
    description: "一款充满野性魅力的男士香水，散发着自然清新的香调",
    volume: "100ml",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z"
  },
  {
    id: 2,
    name: "Chanel No.5 经典女士香水",
    brand: "Chanel",
    sku: "CHN-NO5-50",
    price: 1299,
    originalPrice: null,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"],
    isActive: true,
    isFeatured: false,
    category: { id: 1, name: "香水类" },
    subcategory: { id: 2, name: "香精（Parfum）" },
    description: "经典永恒的女士香水，优雅迷人的花香调",
    volume: "50ml",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T12:15:00Z"
  },
  {
    id: 3,
    name: "Tom Ford Black Orchid",
    brand: "Tom Ford",
    sku: "TF-BO-75",
    price: 1599,
    originalPrice: 1799,
    stock: 8,
    images: ["https://images.unsplash.com/photo-1563401985-64b8aeebc8b0?w=400"],
    isActive: false,
    isFeatured: true,
    category: { id: 1, name: "香水类" },
    subcategory: { id: 1, name: "淡香精（Eau de Parfum）" },
    description: "神秘而奢华的香水，带有黑兰花的独特香调",
    volume: "75ml",
    createdAt: "2024-01-05T14:20:00Z",
    updatedAt: "2024-01-22T09:45:00Z"
  },
  {
    id: 4,
    name: "Jo Malone 英国梨与小苍兰香氛蜡烛",
    brand: "Jo Malone",
    sku: "JM-PEAR-200G",
    price: 520,
    originalPrice: null,
    stock: 32,
    images: ["https://images.unsplash.com/photo-1602874801006-39554432af51?w=400"],
    isActive: true,
    isFeatured: false,
    category: { id: 2, name: "家居香氛类" },
    subcategory: { id: 3, name: "香氛蜡烛" },
    description: "清新的英国梨与小苍兰香氛蜡烛，为家居带来优雅香氛",
    volume: "200g",
    createdAt: "2024-01-12T16:30:00Z",
    updatedAt: "2024-01-19T11:20:00Z"
  },
  {
    id: 5,
    name: "Diptyque Baies 浆果香氛蜡烛",
    brand: "Diptyque",
    sku: "DIP-BAIES-190G",
    price: 480,
    originalPrice: 560,
    stock: 0,
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"],
    isActive: false,
    isFeatured: false,
    category: { id: 2, name: "家居香氛类" },
    subcategory: { id: 3, name: "香氛蜡烛" },
    description: "浆果香调的香氛蜡烛，带来温暖舒适的氛围",
    volume: "190g",
    createdAt: "2024-01-08T13:45:00Z",
    updatedAt: "2024-01-21T10:30:00Z"
  },
  {
    id: 6,
    name: "Hermès Un Jardin Sur Le Toit 屋顶花园",
    brand: "Hermès",
    sku: "HER-JARDIN-100",
    price: 1180,
    originalPrice: null,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1592327962175-824c5acc5884?w=400"],
    isActive: true,
    isFeatured: true,
    category: { id: 1, name: "香水类" },
    subcategory: { id: 4, name: "淡香水（Eau de Toilette）" },
    description: "屋顶花园香水，带有清新的草本植物香调",
    volume: "100ml",
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-23T14:50:00Z"
  }
]

export function ProductManagement() {
  const [products, setProducts] = useState<AdminProduct[]>(mockProducts)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  // 切换商品状态
  const toggleProductStatus = async (productId: number, isActive: boolean) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isActive: !isActive, updatedAt: new Date().toISOString() }
          : product
      )
    )
  }

  // 批量操作
  const handleBatchOperation = async (operation: 'activate' | 'deactivate') => {
    if (selectedProducts.length === 0) return

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const isActive = operation === 'activate'
    setProducts(prev => 
      prev.map(product => 
        selectedProducts.includes(product.id)
          ? { ...product, isActive, updatedAt: new Date().toISOString() }
          : product
      )
    )
    
    setSelectedProducts([])
  }

  // 保存商品编辑
  const handleSaveProduct = async () => {
    if (!editingProduct) return
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 600))
    
    setProducts(prev => 
      prev.map(product => 
        product.id === editingProduct.id 
          ? { ...editingProduct, updatedAt: new Date().toISOString() }
          : product
      )
    )
    
    setEditingProduct(null)
    setEditDialogOpen(false)
  }

  // 开始编辑商品
  const startEditProduct = (product: AdminProduct) => {
    setEditingProduct({ ...product })
    setEditDialogOpen(true)
  }

  // 过滤商品
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.isActive) ||
                         (filterStatus === 'inactive' && !product.isActive)
    
    return matchesSearch && matchesFilter
  })

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
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              <div className="text-sm text-gray-600">总商品数</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.isActive).length}
              </div>
              <div className="text-sm text-gray-600">已上架</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => !p.isActive).length}
              </div>
              <div className="text-sm text-gray-600">已下架</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {products.filter(p => p.stock <= 10).length}
              </div>
              <div className="text-sm text-gray-600">库存不足</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 操作栏 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索商品名称、SKU或品牌..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                全部
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                已上架
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                已下架
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
            </>
          )}
        </div>
      </div>

      {/* 商品表格 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="w-16">图片</TableHead>
                <TableHead>商品信息</TableHead>
                <TableHead>品牌</TableHead>
                <TableHead>分类</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>库存</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{product.brand || '无'}</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{product.category.name}</div>
                      {product.subcategory && (
                        <div className="text-xs text-gray-500">
                          {product.subcategory.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">¥{product.price}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          ¥{product.originalPrice}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      product.stock === 0 
                        ? 'text-red-600' 
                        : product.stock <= 10 
                        ? 'text-orange-600' 
                        : 'text-green-600'
                    }`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到商品</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? '请尝试调整搜索条件或筛选器' 
              : '暂无商品数据'
            }
          </p>
        </div>
      )}

      {/* 编辑商品对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑商品</DialogTitle>
            <DialogDescription>
              修改商品的基本信息和参数
            </DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">商品名称</Label>
                  <Input
                    id="name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct(prev => 
                      prev ? { ...prev, name: e.target.value } : null
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">品牌</Label>
                  <Input
                    id="brand"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct(prev => 
                      prev ? { ...prev, brand: e.target.value } : null
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct(prev => 
                      prev ? { ...prev, sku: e.target.value } : null
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volume">规格</Label>
                  <Input
                    id="volume"
                    value={editingProduct.volume || ''}
                    onChange={(e) => setEditingProduct(prev => 
                      prev ? { ...prev, volume: e.target.value } : null
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">价格</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct(prev => 
                      prev ? { ...prev, price: Number(e.target.value) } : null
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">原价</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingProduct(prev => 
                      prev ? { ...prev, originalPrice: e.target.value ? Number(e.target.value) : null } : null
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">库存</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct(prev => 
                      prev ? { ...prev, stock: Number(e.target.value) } : null
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">商品描述</Label>
                <Textarea
                  id="description"
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingProduct.isActive}
                    onChange={(e) => setEditingProduct(prev => 
                      prev ? { ...prev, isActive: e.target.checked } : null
                    )}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">已上架</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct(prev => 
                      prev ? { ...prev, isFeatured: e.target.checked } : null
                    )}
                    className="rounded"
                  />
                  <Label htmlFor="isFeatured">精选商品</Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              取消
            </Button>
            <Button onClick={handleSaveProduct}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 