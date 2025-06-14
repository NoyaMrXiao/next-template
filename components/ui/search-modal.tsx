"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"

interface SearchResult {
  id: string
  name: string
  brand: string
  price: number
  imageUrl: string
  category: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // 模拟商品数据
  const allProducts: SearchResult[] = [
    {
      id: "1",
      name: "香奈儿五号经典香水",
      brand: "CHANEL",
      price: 899,
      imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      category: "女士香水"
    },
    {
      id: "2",
      name: "迪奥真我香水",
      brand: "DIOR",
      price: 699,
      imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400",
      category: "女士香水"
    },
    {
      id: "3",
      name: "兰蔻奇迹香水",
      brand: "LANCOME",
      price: 600,
      imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400",
      category: "女士香水"
    },
    {
      id: "4",
      name: "祖马龙英国梨香水",
      brand: "JO MALONE",
      price: 459,
      imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400",
      category: "中性香水"
    },
    {
      id: "5",
      name: "汤姆福特黑兰花香水",
      brand: "TOM FORD",
      price: 1299,
      imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400",
      category: "女士香水"
    },
    {
      id: "6",
      name: "爱马仕大地男士香水",
      brand: "HERMES",
      price: 799,
      imageUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",
      category: "男士香水"
    },
    {
      id: "7",
      name: "宝格丽蓝茶香水",
      brand: "BVLGARI",
      price: 559,
      imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
      category: "中性香水"
    }
  ]

  // 热门搜索词
  const hotSearches = [
    "香奈儿", "迪奥", "兰蔻", "祖马龙", "汤姆福特", "爱马仕", "女士香水", "男士香水"
  ]

  // 搜索建议
  const searchSuggestions = [
    "香奈儿五号", "迪奥真我", "兰蔻奇迹", "祖马龙英国梨", "汤姆福特黑兰花"
  ]

  // 从localStorage加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  // 模态框打开时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // 搜索功能
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    
    // 模拟搜索延迟
    setTimeout(() => {
      const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5) // 只显示前5个结果
      setSearchResults(results)
      setIsLoading(false)
    }, 300)
  }

  // 处理搜索输入
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    handleSearch(query)
  }

  // 执行搜索并保存历史
  const executeSearch = (query: string) => {
    if (!query.trim()) return

    // 保存到搜索历史
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))

    // 跳转到搜索结果页面
    router.push(`/search?q=${encodeURIComponent(query)}`)
    handleClose()
  }

  // 查看全部搜索结果
  const viewAllResults = () => {
    if (searchQuery.trim()) {
      executeSearch(searchQuery)
    }
  }

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  // 关闭模态框
  const handleClose = () => {
    setSearchQuery("")
    setSearchResults([])
    onClose()
  }

  // 键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      executeSearch(searchQuery)
    } else if (e.key === 'Escape') {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 搜索框 */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center p-6 border-b border-gray-200">
              <Search className="w-6 h-6 text-gray-400 mr-4" />
              <input
                ref={inputRef}
                type="text"
                placeholder="搜索香水、品牌或分类..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 text-lg outline-none placeholder-gray-400"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* 搜索内容区域 */}
            <div className="max-h-[70vh] overflow-y-auto">
              {!searchQuery ? (
                // 默认状态：搜索历史和热门搜索
                <div className="p-6 space-y-6">
                  {/* 搜索历史 */}
                  {searchHistory.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-gray-500" />
                          搜索历史
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearHistory}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          清除
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchHistory.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => executeSearch(item)}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 热门搜索 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-rose-500" />
                      热门搜索
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {hotSearches.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => executeSearch(item)}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-sm transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 搜索建议 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">推荐搜索</h3>
                    <div className="space-y-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => executeSearch(suggestion)}
                          className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <span className="text-gray-700">{suggestion}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // 搜索结果
                <div className="p-6">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                      <p className="text-gray-500 mt-4">搜索中...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-600">
                          找到 <span className="font-semibold text-gray-900">{searchResults.length}</span> 个相关结果
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={viewAllResults}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                          查看全部结果
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            onClick={handleClose}
                          >
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                  <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image
                                      src={product.imageUrl}
                                      alt={product.name}
                                      fill
                                      className="object-cover rounded-lg"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                      {product.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 mb-1">
                                      {product.brand} · {product.category}
                                    </p>
                                    <p className="text-lg font-bold text-rose-500">
                                      ¥{product.price}
                                    </p>
                                  </div>
                                  <ArrowRight className="w-5 h-5 text-gray-400" />
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                      
                      {/* 查看更多结果 */}
                      <div className="mt-6 text-center">
                        <Button
                          onClick={viewAllResults}
                          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                        >
                          查看全部 "{searchQuery}" 的搜索结果
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">未找到相关结果</h3>
                      <p className="text-gray-600 mb-6">
                        试试搜索其他关键词，或浏览我们的热门商品
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {hotSearches.slice(0, 4).map((item, index) => (
                          <button
                            key={index}
                            onClick={() => executeSearch(item)}
                            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-sm transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 