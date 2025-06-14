"use client"

import Link from "next/link"
import { Button } from "./button"
import { ShoppingCart, Search, User, Menu, X, Package, Settings, LogOut, ChevronDown, Heart } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { SearchModal } from "./search-modal"
import { AuthModal } from "./auth-modal"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { logoutUser } from "@/actions/auth"
import toast from 'react-hot-toast'

const navItems = [
  { name: "全部", href: "/categories/all" },
  { name: "新品上市", href: "/new" },
  { name: "礼盒套装", href: "/gifts" },
  { name: "香味文创", href: "/creative" },
]

const userMenuItems = [
  { name: "我的订单", href: "/orders", icon: Package },
  { name: "个人设置", href: "/profile", icon: Settings },
]

export function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')
  const [searchQuery, setSearchQuery] = useState("")
  const [isNavHovered, setIsNavHovered] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const { state } = useCart()
  const { state: favoritesState } = useFavorites()
  const { user, isAuthenticated, isLoading: authLoading, setUser } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // 点击外部关闭用户菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 键盘快捷键
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Ctrl/Cmd + K 打开搜索
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // 跳转到搜索页面
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false) // 关闭移动端菜单
    }
  }

  const handleLogin = (tab: 'login' | 'register') => {
    setAuthModalTab(tab)
    setIsAuthModalOpen(true)
    setIsUserMenuOpen(false)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const result = await logoutUser()
      if (result.success) {
        setUser(null)
        toast.success(result.message || '已成功退出登录')
        setIsUserMenuOpen(false)
      } else {
        toast.error(result.error || '退出登录失败')
      }
    } catch (error) {
      toast.error('退出登录失败，请稍后重试')
    } finally {
      setIsLoggingOut(false)
    }
  }

  // 格式化用户显示信息
  const formatUserDisplay = () => {
    if (!user) return { name: '未登录', detail: '' }
    
    const name = user.name || '用户'
    const detail = user.phone ? 
      `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}` : 
      user.email
    
    return { name, detail }
  }

  const userDisplay = formatUserDisplay()

  return (
    <>
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300"
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center min-w-[160px]">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-semibold tracking-tight text-gray-900">ODE偶的</span>
              </Link>
            </div>

            {/* 中间搜索栏 */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索香水、香薰、香氛饰品..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-4 pr-12 text-sm border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 focus:outline-none transition-all placeholder-gray-500"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-2 min-w-[200px] justify-end">
              {/* 移动端搜索按钮 */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-gray-700 hover:text-gray-900"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* 用户菜单 */}
              <div className="relative" ref={userMenuRef}>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  disabled={authLoading}
                >
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">
                    {authLoading ? '加载中...' : (isAuthenticated ? '账户' : '登录')}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
                
                {/* 用户下拉菜单 */}
                {isUserMenuOpen && !authLoading && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{userDisplay.name}</p>
                          <p className="text-xs text-gray-500">{userDisplay.detail}</p>
                        </div>
                        {userMenuItems.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Icon className="h-4 w-4 mr-3" />
                              {item.name}
                            </Link>
                          )
                        })}
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          {isLoggingOut ? '退出中...' : '退出登录'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          onClick={() => handleLogin('login')}
                        >
                          <User className="h-4 w-4 mr-3" />
                          登录
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          onClick={() => handleLogin('register')}
                        >
                          <User className="h-4 w-4 mr-3" />
                          注册
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 收藏 */}
              <Link href="/favorites">
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900 relative">
                  <Heart className="h-5 w-5" />
                  {favoritesState.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favoritesState.totalItems > 99 ? '99+' : favoritesState.totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* 购物车 */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900 relative">
                  <ShoppingCart className="h-5 w-5" />
                  {state.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {state.totalItems > 99 ? '99+' : state.totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* 移动端菜单按钮 */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-700 hover:text-gray-900"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* 第二行导航菜单 - 悬浮时显示 */}
          <div className={`hidden md:block transition-all duration-300 overflow-hidden ${
            isNavHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="flex items-center justify-center py-3 border-t border-gray-100">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm tracking-wide"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 移动端菜单 */}
          {isMenuOpen && (
            <div className="md:hidden py-6 border-t border-gray-100 bg-white">
              <div className="flex flex-col space-y-4">
                {/* 移动端搜索 */}
                <div className="px-4">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="搜索香水、香薰、香氛饰品..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-4 pr-12 text-sm border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:border-gray-400 focus:ring-2 focus:ring-gray-100 focus:outline-none transition-all placeholder-gray-500"
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>

                {/* 导航项 */}
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-700 font-medium px-4 py-2 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm tracking-wide"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* 移动端快捷操作 */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-around px-4 mb-4">
                    <Link
                      href="/favorites"
                      className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="relative">
                        <Heart className="h-6 w-6" />
                        {favoritesState.totalItems > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {favoritesState.totalItems}
                          </span>
                        )}
                      </div>
                      <span className="text-xs">收藏</span>
                    </Link>
                    <Link
                      href="/cart"
                      className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="relative">
                        <ShoppingCart className="h-6 w-6" />
                        {state.totalItems > 0 && (
                          <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {state.totalItems}
                          </span>
                        )}
                      </div>
                      <span className="text-xs">购物车</span>
                    </Link>
                  </div>
                </div>
                
                {/* 移动端用户菜单 */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 mb-2">
                        <p className="text-sm font-medium text-gray-900">{userDisplay.name}</p>
                        <p className="text-xs text-gray-500">{userDisplay.detail}</p>
                      </div>
                      {userMenuItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon className="h-4 w-4 mr-3" />
                            {item.name}
                          </Link>
                        )
                      })}
                      <button
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        {isLoggingOut ? '退出中...' : '退出登录'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        onClick={() => {
                          handleLogin('login')
                          setIsMenuOpen(false)
                        }}
                      >
                        <User className="h-4 w-4 mr-3" />
                        登录
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        onClick={() => {
                          handleLogin('register')
                          setIsMenuOpen(false)
                        }}
                      >
                        <User className="h-4 w-4 mr-3" />
                        注册
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 搜索模态框 */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* 认证模态框 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  )
}