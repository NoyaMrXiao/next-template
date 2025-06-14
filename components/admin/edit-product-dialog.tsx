'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { X, Plus, Upload, Edit } from 'lucide-react'
import { createProduct, getCategories, generateSKU, type CreateProductData } from '@/actions/product'

interface Category {
  id: number
  name: string
  subcategories: {
    id: number
    name: string
  }[]
}

interface Product {
  id: number
  name: string
  brand: string | null
  sku: string
  price: number
  originalPrice: number | null
  stock: number
  minStock?: number
  weight?: number
  volume?: string
  images: string[]
  tags?: string[]
  isActive: boolean
  isFeatured: boolean
  sort?: number
  categoryId: number
  subcategoryId?: number
  description?: string
  content?: string
}

interface EditProductDialogProps {
  product: Product
  onProductUpdate?: () => void
}

export default function EditProductDialog({ product, onProductUpdate }: EditProductDialogProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CreateProductData>({
    categoryId: product.categoryId,
    subcategoryId: product.subcategoryId,
    name: product.name,
    brand: product.brand || undefined,
    sku: product.sku,
    price: product.price,
    originalPrice: product.originalPrice || undefined,
    stock: product.stock,
    minStock: product.minStock,
    weight: product.weight,
    volume: product.volume,
    images: product.images,
    tags: product.tags || [],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    sort: product.sort || 0,
    description: product.description,
    content: product.content
  })
  const [tags, setTags] = useState<string[]>(product.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>(product.images)
  const [imageInput, setImageInput] = useState('')

  // 加载分类数据
  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories()
      if (result.success && result.data) {
        setCategories(result.data)
      }
    }
    loadCategories()
  }, [])

  // 重置表单到产品数据
  const resetForm = () => {
    setFormData({
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      name: product.name,
      brand: product.brand || undefined,
      sku: product.sku,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      stock: product.stock,
      minStock: product.minStock,
      weight: product.weight,
      volume: product.volume,
      images: product.images,
      tags: product.tags || [],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      sort: product.sort || 0,
      description: product.description,
      content: product.content
    })
    setTags(product.tags || [])
    setTagInput('')
    setImageUrls(product.images)
    setImageInput('')
  }

  // 添加标签
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  // 删除标签
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  // 添加图片
  const addImage = () => {
    if (imageInput.trim() && !imageUrls.includes(imageInput.trim())) {
      setImageUrls([...imageUrls, imageInput.trim()])
      setImageInput('')
    }
  }

  // 删除图片
  const removeImage = (url: string) => {
    setImageUrls(imageUrls.filter(img => img !== url))
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryId || !formData.name || !formData.sku || !formData.price) {
      alert('请填写必填字段')
      return
    }

    setLoading(true)
    
    const submitData: CreateProductData = {
      ...formData,
      tags,
      images: imageUrls
    }

    // 这里应该调用更新商品的API，暂时用创建API代替
    const result = await createProduct(submitData)
    
    if (result.success) {
      alert('商品更新成功')
      setOpen(false)
      onProductUpdate?.()
      router.refresh()
    } else {
      alert(result.error || '更新失败')
    }
    
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="h-3 w-3" />
          编辑
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">编辑商品</DialogTitle>
        </DialogHeader>
        <div className="max-h-[80vh] pr-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">商品名称 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="请输入商品名称"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">品牌</Label>
                <Input
                  id="brand"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="请输入品牌名称"
                />
              </div>
            </div>

            {/* SKU 和价格 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">商品编码 (SKU) *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  placeholder="商品编码"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">价格 (元) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="originalPrice">原价 (元)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({...formData, originalPrice: parseFloat(e.target.value) || undefined})}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* 分类选择 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>商品分类 *</Label>
                <Select 
                  value={formData.categoryId.toString()} 
                  onValueChange={(value: string) => setFormData({...formData, categoryId: parseInt(value), subcategoryId: undefined})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>子分类</Label>
                <Select 
                  value={formData.subcategoryId?.toString() || ''} 
                  onValueChange={(value: string) => setFormData({...formData, subcategoryId: value ? parseInt(value) : undefined})}
                  disabled={!formData.categoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择子分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .find(c => c.id === formData.categoryId)
                      ?.subcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id.toString()}>
                          {sub.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 库存和规格 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">库存数量 *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minStock">最低库存</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock || ''}
                  onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || undefined})}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">重量 (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || undefined})}
                  placeholder="0.000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="volume">容量/规格</Label>
                <Input
                  id="volume"
                  value={formData.volume || ''}
                  onChange={(e) => setFormData({...formData, volume: e.target.value})}
                  placeholder="如: 50ml"
                />
              </div>
            </div>

            {/* 商品描述 */}
            <div className="space-y-2">
              <Label htmlFor="description">商品描述</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="请输入商品描述"
                rows={2}
              />
            </div>

            {/* 详细内容 */}
            <div className="space-y-2">
              <Label htmlFor="content">详细内容</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="请输入详细的商品介绍"
                rows={3}
              />
            </div>

            {/* 标签管理 */}
            <div className="space-y-2">
              <Label>商品标签</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="输入标签（如：法式优雅、持久留香、限量版）"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* 推荐标签 */}
              <div className="space-y-2">
                <div className="text-xs text-gray-500">推荐标签：</div>
                <div className="flex flex-wrap gap-1">
                  {['法式优雅', '持久留香', '限量版', '情人节限定', '小众香水', 
                    '治愈系', '清新淡雅', '浓郁奢华', '中性香调', '纯天然',
                    '手工制作', '古典复古', '现代时尚', '季节限定'].map((tag) => (
                    <Button 
                      key={tag}
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs px-2"
                      onClick={() => {
                        if (!tags.includes(tag)) {
                          setTags([...tags, tag])
                        }
                      }}
                    >
                      + {tag}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* 图片管理 */}
            <div className="space-y-2">
              <Label>商品图片</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="输入图片URL (支持 https:// 链接)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
                <Button type="button" variant="outline" size="sm" onClick={addImage}>
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              
              {/* 示例图片建议 */}
              <div className="space-y-2">
                <div className="text-xs text-gray-500">示例图片（点击使用）：</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400',
                    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
                    'https://images.unsplash.com/photo-1563401985-64b8aeebc8b0?w=400',
                    'https://images.unsplash.com/photo-1602874801006-39554432af51?w=400'
                  ].map((url, index) => (
                    <div 
                      key={index} 
                      className="relative cursor-pointer border rounded hover:shadow-md transition-shadow"
                      onClick={() => {
                        if (!imageUrls.includes(url)) {
                          setImageUrls([...imageUrls, url])
                        }
                      }}
                    >
                      <img
                        src={url}
                        alt={`示例 ${index + 1}`}
                        className="w-full h-16 object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity rounded flex items-center justify-center">
                        <Plus className="text-white opacity-0 hover:opacity-100 transition-opacity h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`商品图片 ${index + 1}`}
                      className="w-full h-16 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0"
                      onClick={() => removeImage(url)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 设置选项 */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive ?? true}
                  onCheckedChange={(checked: boolean) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">启用商品</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured ?? false}
                  onCheckedChange={(checked: boolean) => setFormData({...formData, isFeatured: checked})}
                />
                <Label htmlFor="isFeatured">精选商品</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="sort">排序:</Label>
                <Input
                  id="sort"
                  type="number"
                  min="0"
                  value={formData.sort || 0}
                  onChange={(e) => setFormData({...formData, sort: parseInt(e.target.value) || 0})}
                  className="w-16"
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? '更新中...' : '更新商品'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                取消
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 