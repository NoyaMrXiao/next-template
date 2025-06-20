"use client"

import Link from "next/link"
import { Button } from "./button"
import { ShoppingCart, Search, User, Menu, X, Package, Settings, LogOut, Heart } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useFavorites } from "@/lib/favorites-context"
import { SearchModal } from "./search-modal"
import { AuthModal } from "./auth-modal"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { logoutUser } from "@/actions/auth"
import toast from 'react-hot-toast'

const categoryNavItems = {
  "香水系列": {
    sections: [
      {
        title: "畅销系列",
        items: [
          { name: "柏木与葡萄藤", href: "/categories/cypress-grapevine" },
          { name: "末药与冬加豆", href: "/categories/myrrh-tonka" },
          { name: "鼠尾草与海盐", href: "/categories/sage-salt" },
          { name: "青柠罗勒与柑橘", href: "/categories/lime-basil-mandarin" },
        ]
      },
      {
        title: "香调家族",
        items: [
          { name: "柑橘香调", href: "/categories/citrus" },
          { name: "花香调", href: "/categories/floral" },
          { name: "果香调", href: "/categories/fruity" },
          { name: "木质香调", href: "/categories/woody" },
        ]
      }
    ]
  },
  "身体护理": {
    sections: [
      {
        title: "护理系列",
        items: [
          { name: "沐浴露", href: "/categories/body-wash" },
          { name: "身体乳", href: "/categories/body-lotion" },
          { name: "护手霜", href: "/categories/hand-cream" },
          { name: "身体磨砂", href: "/categories/body-scrub" },
        ]
      }
    ]
  },
  "居家香氛": {
    sections: [
      {
        title: "香氛系列",
        items: [
          { name: "香薰蜡烛", href: "/categories/candles" },
          { name: "扩香器", href: "/categories/diffusers" },
          { name: "室内喷雾", href: "/categories/room-sprays" },
          { name: "车载香氛", href: "/categories/car-diffusers" },
        ]
      }
    ]
  }
}

const navItems = [
  { name: "全部", href: "/categories/all", hasDropdown: true },
  { name: "新品", href: "/new" },
  { name: "礼品", href: "/gifts" },
  { name: "品牌", href: "/brands" },
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
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  const { state } = useCart()
  const { state: favoritesState } = useFavorites()
  const { user, isAuthenticated, isLoading: authLoading, setUser } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
    <div className="relative">
      <nav className="sticky w-full z-50 bg-primary backdrop-blur-sm " ref={navRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-light tracking-wider text-gray-900 hover:text-gray-700 transition-colors">
                  ODE偶的
                </span>
              </Link>
            </div>

            {/* 中间导航菜单 - 桌面版 */}
            <div className="hidden lg:flex items-center space-x-12">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-gray-900 font-light text-sm tracking-wide transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
              ))}
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-1">
              {/* 搜索 */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-200"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* 用户菜单 */}
              <div className="relative" ref={userMenuRef}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-200"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  disabled={authLoading}
                >
                  <User className="h-5 w-5" />
                </Button>
                
                {/* 用户下拉菜单 */}
                {isUserMenuOpen && !authLoading && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{userDisplay.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{userDisplay.detail}</p>
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
                              <Icon className="h-4 w-4 mr-3 text-gray-400" />
                              {item.name}
                            </Link>
                          )
                        })}
                        <div className="border-t border-gray-100 mt-1">
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                          >
                            <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                            {isLoggingOut ? '退出中...' : '退出登录'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          onClick={() => handleLogin('login')}
                        >
                          登录
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          onClick={() => handleLogin('register')}
                        >
                          注册
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 收藏 */}
              <Link href="/favorites">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-200 relative"
                >
                  <Heart className="h-5 w-5" />
                  {favoritesState.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {favoritesState.totalItems > 9 ? '9+' : favoritesState.totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* 购物车 */}
              <Link href="/cart">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-200 relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {state.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {state.totalItems > 9 ? '9+' : state.totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* 移动端菜单按钮 */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>  

      {/* 下拉菜单 - 独立于导航栏 */}
      {activeDropdown && (
        <div 
          className="absolute w-full bg-primary shadow-lg z-40"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-8 py-8 bg-primary">
            <div className="grid grid-cols-3 gap-8">
              {Object.entries(categoryNavItems).map(([category, { sections }]) => (
                <div key={category} className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                  {sections.map((section) => (
                    <div key={section.title} className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-500">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.items.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-primary backdrop-blur-sm">
          <div className="py-6 space-y-1">
            {/* 导航项 */}
            {navItems.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-light text-sm tracking-wide transition-colors"
                  onClick={() => !item.hasDropdown && setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
                
                {/* 移动端分类导航 */}
                {item.hasDropdown && (
                  <div className="bg-gray-50 py-4">
                    {Object.entries(categoryNavItems).map(([category, { sections }]) => (
                      <div key={category} className="mb-6">
                        <h3 className="px-4 text-sm font-medium text-gray-900 mb-3">{category}</h3>
                        {sections.map((section) => (
                          <div key={section.title} className="mb-4">
                            <h4 className="px-4 text-xs font-medium text-gray-500 mb-2">{section.title}</h4>
                            {section.items.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="block px-6 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* 移动端用户菜单 */}
            <div className="border-t border-gray-100 mt-4 pt-4">
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-gray-900">{userDisplay.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{userDisplay.detail}</p>
                  </div>
                  {userMenuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    )
                  })}
                  <button
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-sm">{isLoggingOut ? '退出中...' : '退出登录'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => {
                      handleLogin('login')
                      setIsMenuOpen(false)
                    }}
                  >
                    <span className="text-sm">登录</span>
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => {
                      handleLogin('register')
                      setIsMenuOpen(false)
                    }}
                  >
                    <span className="text-sm">注册</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
    </div>
  )
}