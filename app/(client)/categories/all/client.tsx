'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Grid, List } from 'lucide-react'
import { CategoryWithStats, ProductWithDetails } from '@/actions/categories-page'
import { ProductCard } from '@/components/product-card'

interface AllCategoriesClientProps {
  categories: CategoryWithStats[]
  products: ProductWithDetails[]
  initialCategory?: string
  initialSubcategory?: string
}

export function AllCategoriesClient({
  categories,
  products,
  initialCategory,
  initialSubcategory
}: AllCategoriesClientProps) {
  const router = useRouter()
  
  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showSortOptions, setShowSortOptions] = useState(false)

  // 点击外部关闭排序下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-sort-dropdown]')) {
        setShowSortOptions(false)
      }
    }

    if (showSortOptions) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSortOptions])

  // 更新URL参数
  const updateURL = (category?: string, subcategory?: string) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (subcategory) params.set('subcategory', subcategory)
    
    const url = params.toString() ? `?${params.toString()}` : ''
    router.push(`/categories/all${url}`, { scroll: false })
  }

  // 处理分类选择
  const handleCategorySelect = (categoryName: string) => {
    const newCategory = selectedCategory === categoryName ? '' : categoryName
    setSelectedCategory(newCategory)
    setSelectedSubcategory('') // 重置子分类
    updateURL(newCategory, '')
  }

  // 处理子分类选择
  const handleSubcategorySelect = (subcategoryName: string) => {
    const newSubcategory = selectedSubcategory === subcategoryName ? '' : subcategoryName
    setSelectedSubcategory(newSubcategory)
    updateURL(selectedCategory, newSubcategory)
  }

  // 筛选和排序商品
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // 按分类筛选
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // 按子分类筛选
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory)
    }

    // 排序
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // 保持默认顺序
        break
    }

    return filtered
  }, [products, selectedCategory, selectedSubcategory, sortBy])

  // 获取当前选中分类的子分类
  const currentSubcategories = useMemo(() => {
    if (!selectedCategory) return []
    const category = categories.find(cat => cat.name === selectedCategory)
    return category?.subcategories || []
  }, [categories, selectedCategory])

  // 生成页面标题
  const pageTitle = useMemo(() => {
    if (selectedSubcategory) {
      return `${selectedCategory} - ${selectedSubcategory}`
    }
    if (selectedCategory) {
      return selectedCategory
    }
    return '全部分类'
  }, [selectedCategory, selectedSubcategory])

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="flex">
        {/* 左侧分类导航 */}
        <aside className="hidden md:block w-80 h-screen sticky top-16 overflow-y-auto">
          <div className="bg-white p-8">
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{pageTitle}</h2>
              <p className="text-sm text-gray-600">
                {filteredAndSortedProducts.length} 件商品
              </p>
            </div>
            
            {/* 分类列表 */}
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <button
                    onClick={() => handleCategorySelect(category.name)}
                    className={`text-sm text-left transition-colors duration-200 ${
                      selectedCategory === category.name
                        ? 'text-black font-semibold'
                        : 'text-gray-600 hover:text-gray-900 font-medium'
                    }`}
                  >
                    {category.name}
                  </button>
                  
                  {/* 子分类 */}
                  {selectedCategory === category.name && currentSubcategories.length > 0 && (
                    <div className="ml-4 space-y-2 mt-3 border-l border-gray-200 pl-4">
                      {currentSubcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => handleSubcategorySelect(subcategory)}
                          className={`block text-sm text-left transition-colors duration-200 ${
                            selectedSubcategory === subcategory
                              ? 'text-black font-semibold'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 p-4 md:p-8"> 
          {/* 工具栏 */}
          <div className="mb-8">
            {/* 移动端筛选按钮 */}
            <div className="flex items-center justify-between mb-6">
              <div className="md:hidden">
                <h1 className="text-xl font-bold text-gray-900 mb-1">{pageTitle}</h1>
                <p className="text-sm text-gray-600">
                  {filteredAndSortedProducts.length} 件商品
                </p>
              </div>
              
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
              >
                <Filter className="w-4 h-4" />
                <span>筛选</span>
              </button>
            </div>

            {/* 搜索和排序工具栏 */}
            <div className="flex justify-end items-center gap-4">
              {/* 排序选择 */}
              <div className="relative" data-sort-dropdown>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by</span>
                  <button
                    onClick={() => setShowSortOptions(!showSortOptions)}
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
                  >
                    {sortBy === 'default' && 'Default'}
                    {sortBy === 'price-asc' && 'Price: Low to High'}
                    {sortBy === 'price-desc' && 'Price: High to Low'}
                    {sortBy === 'name' && 'Name'}
                  </button>
                </div>
                
                {showSortOptions && (
                  <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                    <div className="py-2">
                      {[
                        { value: 'default', label: 'Default' },
                        { value: 'price-asc', label: 'Price: Low to High' },
                        { value: 'price-desc', label: 'Price: High to Low' },
                        { value: 'name', label: 'Name' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as any)
                            setShowSortOptions(false)
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                            sortBy === option.value
                              ? 'text-black font-semibold bg-gray-50'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 视图模式切换 */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 商品列表 */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到相关商品</h3>
              <p className="text-gray-600 mb-6">试试调整筛选条件或搜索关键词</p>
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedSubcategory('')
                  updateURL('', '')
                }}
                className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                清除筛选
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 移动端筛选面板 */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">筛选</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* 移动端分类列表 */}
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <button
                    onClick={() => handleCategorySelect(category.name)}
                    className={`text-sm text-left transition-colors duration-200 ${
                      selectedCategory === category.name
                        ? 'text-black font-semibold'
                        : 'text-gray-600 hover:text-gray-900 font-medium'
                    }`}
                  >
                    {category.name}
                  </button>
                  
                  {selectedCategory === category.name && currentSubcategories.length > 0 && (
                    <div className="ml-4 space-y-2 mt-3 border-l border-gray-200 pl-4">
                      {currentSubcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => handleSubcategorySelect(subcategory)}
                          className={`block text-sm text-left transition-colors duration-200 ${
                            selectedSubcategory === subcategory
                              ? 'text-black font-semibold'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
