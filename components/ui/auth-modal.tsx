'use client'

import { useState, useEffect } from "react"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { Label } from "./label"
import { X, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from "lucide-react"
import { registerUser, loginUser, RegisterData, LoginData } from "@/actions/auth"
import { useAuth } from "@/lib/auth-context"
import { validateEmail, validatePassword, validatePhone, validateUsername } from "@/lib/validation"
import toast from 'react-hot-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const { setUser, refreshUser } = useAuth()

  // 重置表单状态
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
      setErrors({})
      setIsLoading(false)
      setLoginForm({
        email: '',
        password: '',
        rememberMe: false
      })
      setRegisterForm({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      })
    }
  }, [isOpen, defaultTab])

  if (!isOpen) return null

  // 实时验证函数
  const validateField = (field: string, value: string, form: 'login' | 'register') => {
    const newErrors = { ...errors }

    switch (field) {
      case 'email':
        if (!value) {
          newErrors.email = '请输入邮箱'
        } else if (!validateEmail(value)) {
          newErrors.email = '请输入有效的邮箱地址'
        } else {
          delete newErrors.email
        }
        break

      case 'password':
        if (!value) {
          newErrors.password = '请输入密码'
        } else if (form === 'register') {
          const validation = validatePassword(value)
          if (!validation.isValid) {
            newErrors.password = validation.message || '密码格式不正确'
          } else {
            delete newErrors.password
          }
        } else {
          delete newErrors.password
        }
        break

      case 'username':
        if (!value) {
          newErrors.username = '请输入用户名'
        } else {
          const validation = validateUsername(value)
          if (!validation.isValid) {
            newErrors.username = validation.message || '用户名格式不正确'
          } else {
            delete newErrors.username
          }
        }
        break

      case 'phone':
        if (!value) {
          newErrors.phone = '请输入手机号'
        } else if (!validatePhone(value)) {
          newErrors.phone = '请输入有效的手机号'
        } else {
          delete newErrors.phone
        }
        break

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = '请确认密码'
        } else if (value !== registerForm.password) {
          newErrors.confirmPassword = '两次输入的密码不一致'
        } else {
          delete newErrors.confirmPassword
        }
        break
    }

    setErrors(newErrors)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const result = await loginUser(loginForm as LoginData)

      if (result.success && result.user) {
        setUser(result.user)
        await refreshUser()
        toast.success(result.message || '登录成功')
        onClose()
      } else {
        setErrors({ general: result.error || '登录失败' })
        toast.error(result.error || '登录失败')
      }
    } catch (error) {
      setErrors({ general: '登录过程中发生错误，请稍后重试' })
      toast.error('登录过程中发生错误')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // 验证表单
    if (!registerForm.agreeToTerms) {
      setErrors({ agreeToTerms: '请阅读并同意用户协议和隐私政策' })
      setIsLoading(false)
      return
    }

    try {
      const result = await registerUser(registerForm as RegisterData)

      if (result.success && result.user) {
        setUser(result.user)
        await refreshUser()
        toast.success(result.message || '注册成功')
        onClose()
      } else {
        setErrors({ general: result.error || '注册失败' })
        toast.error(result.error || '注册失败')
      }
    } catch (error) {
      setErrors({ general: '注册过程中发生错误，请稍后重试' })
      toast.error('注册过程中发生错误')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 模态框内容 */}
      <Card className="relative w-full max-w-md mx-4 bg-white shadow-2xl">
        <CardHeader className="relative pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <CardTitle className="text-center text-2xl font-bold text-gray-900 mt-2">
            {activeTab === 'login' ? '登录账户' : '注册账户'}
          </CardTitle>

          {/* 标签切换 */}
          <div className="flex bg-gray-100 rounded-none p-1 mt-4">
            <button
              className={`flex-1 py-2 px-4 rounded-none text-sm font-medium transition-all ${activeTab === 'login'
                  ? 'bg-white text-black/90 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
              onClick={() => setActiveTab('login')}
            >
              登录
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-none text-sm font-medium transition-all ${activeTab === 'register'
                  ? 'bg-white text-black/90 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
              onClick={() => setActiveTab('register')}
            >
              注册
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* 通用错误提示 */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-none flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">{errors.general}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱"
                    value={loginForm.email}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, email: e.target.value })
                      validateField('email', e.target.value, 'login')
                    }}
                    className={`pl-10 ${errors.email ? 'border-red-300' : ''}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, password: e.target.value })
                      validateField('password', e.target.value, 'login')
                    }}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-300' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                  />
                  记住我
                </label>
                <button type="button" className="text-black/90 hover:text-black/100">
                  忘记密码？
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-black/90 hover:bg-black/100"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                还没有账户？
                <button
                  type="button"
                  className="text-black/90 hover:text-black/100 ml-1"
                  onClick={() => setActiveTab('register')}
                >
                  立即注册
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={registerForm.username}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, username: e.target.value })
                      validateField('username', e.target.value, 'register')
                    }}
                    className={`pl-10 ${errors.username ? 'border-red-300' : ''}`}
                    required
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-600">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">邮箱</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="请输入邮箱"
                    value={registerForm.email}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, email: e.target.value })
                      validateField('email', e.target.value, 'register')
                    }}
                    className={`pl-10 ${errors.email ? 'border-red-300' : ''}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={registerForm.phone}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, phone: e.target.value })
                      validateField('phone', e.target.value, 'register')
                    }}
                    className={`pl-10 ${errors.phone ? 'border-red-300' : ''}`}
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={registerForm.password}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, password: e.target.value })
                      validateField('password', e.target.value, 'register')
                    }}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-300' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">确认密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="请再次输入密码"
                    value={registerForm.confirmPassword}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                      validateField('confirmPassword', e.target.value, 'register')
                    }}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="text-sm">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mr-2 mt-1"
                    checked={registerForm.agreeToTerms}
                    onChange={(e) => setRegisterForm({ ...registerForm, agreeToTerms: e.target.checked })}
                    required
                  />
                  <span className="text-gray-600">
                    我已阅读并同意
                    <button type="button" className="text-black/90 hover:text-black/100 mx-1">
                      用户协议
                    </button>
                    和
                    <button type="button" className="text-black/90 hover:text-black/100 mx-1">
                      隐私政策
                    </button>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-xs text-black/90 mt-1">{errors.agreeToTerms}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-black/90 hover:bg-black/100"
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '注册'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                已有账户？
                <button
                  type="button"
                  className="text-black/90 hover:text-black/100 ml-1"
                  onClick={() => setActiveTab('login')}
                >
                  立即登录
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}