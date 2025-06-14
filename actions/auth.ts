'use server'

import { prisma } from '@/lib/prisma'
import { 
  hashPassword, 
  verifyPassword, 
  createToken, 
  setAuthCookie, 
  removeAuthCookie,
  getCurrentUser,
  UserPayload
} from '@/lib/auth'
import { 
  validateEmail,
  validatePassword,
  validatePhone,
  validateUsername
} from '@/lib/validation'
import { revalidatePath } from 'next/cache'

// 注册数据类型
export interface RegisterData {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

// 登录数据类型
export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

// 统一的响应类型
export interface AuthResponse {
  success: boolean
  message?: string
  error?: string
  user?: UserPayload
}

// 用户注册
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    const { username, email, phone, password, confirmPassword } = data

    // 表单验证
    if (!username || !email || !phone || !password || !confirmPassword) {
      return {
        success: false,
        error: '请填写所有必填字段'
      }
    }

    // 验证用户名
    const usernameValidation = validateUsername(username)
    if (!usernameValidation.isValid) {
      return {
        success: false,
        error: usernameValidation.message
      }
    }

    // 验证邮箱
    if (!validateEmail(email)) {
      return {
        success: false,
        error: '请输入有效的邮箱地址'
      }
    }

    // 验证手机号
    if (!validatePhone(phone)) {
      return {
        success: false,
        error: '请输入有效的手机号'
      }
    }

    // 验证密码
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.message
      }
    }

    // 确认密码
    if (password !== confirmPassword) {
      return {
        success: false,
        error: '两次输入的密码不一致'
      }
    }

    // 检查邮箱是否已存在
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUserByEmail) {
      return {
        success: false,
        error: '该邮箱已被注册'
      }
    }

    // 检查手机号是否已存在
    const existingUserByPhone = await prisma.user.findFirst({
      where: { phone }
    })

    if (existingUserByPhone) {
      return {
        success: false,
        error: '该手机号已被注册'
      }
    }

    // 加密密码
    const hashedPassword = await hashPassword(password)

    // 创建用户
    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        phone,
        password: hashedPassword
      }
    })

    // 创建token
    const userPayload: UserPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name || undefined,
      phone: newUser.phone || undefined
    }

    const token = await createToken(userPayload)
    await setAuthCookie(token)

    // 重新验证相关页面
    revalidatePath('/')

    return {
      success: true,
      message: '注册成功',
      user: userPayload
    }

  } catch (error) {
    console.error('用户注册失败:', error)
    return {
      success: false,
      error: '注册失败，请稍后重试'
    }
  }
}

// 用户登录
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  try {
    const { email, password } = data

    // 表单验证
    if (!email || !password) {
      return {
        success: false,
        error: '请输入邮箱和密码'
      }
    }

    // 验证邮箱格式
    if (!validateEmail(email)) {
      return {
        success: false,
        error: '请输入有效的邮箱地址'
      }
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return {
        success: false,
        error: '邮箱或密码错误'
      }
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        error: '邮箱或密码错误'
      }
    }

    // 创建token
    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      phone: user.phone || undefined
    }

    const token = await createToken(userPayload)
    await setAuthCookie(token)

    // 重新验证相关页面
    revalidatePath('/')

    return {
      success: true,
      message: '登录成功',
      user: userPayload
    }

  } catch (error) {
    console.error('用户登录失败:', error)
    return {
      success: false,
      error: '登录失败，请稍后重试'
    }
  }
}

// 用户登出
export async function logoutUser(): Promise<AuthResponse> {
  try {
    await removeAuthCookie()
    revalidatePath('/')
    
    return {
      success: true,
      message: '已成功退出登录'
    }
  } catch (error) {
    console.error('用户登出失败:', error)
    return {
      success: false,
      error: '登出失败，请稍后重试'
    }
  }
}

// 获取当前用户信息
export async function getCurrentUserInfo(): Promise<UserPayload | null> {
  try {
    return await getCurrentUser()
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

// 检查用户是否已登录
export async function checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: UserPayload }> {
  try {
    const user = await getCurrentUser()
    return {
      isAuthenticated: !!user,
      user: user || undefined
    }
  } catch (error) {
    console.error('检查认证状态失败:', error)
    return {
      isAuthenticated: false
    }
  }
}

// 更新用户资料
export async function updateUserProfile(data: {
  name?: string
  phone?: string
}): Promise<AuthResponse> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return {
        success: false,
        error: '请先登录'
      }
    }

    const { name, phone } = data

    // 验证数据
    if (name && !validateUsername(name).isValid) {
      return {
        success: false,
        error: validateUsername(name).message
      }
    }

    if (phone && !validatePhone(phone)) {
      return {
        success: false,
        error: '请输入有效的手机号'
      }
    }

    // 如果要更新手机号，检查是否已被使用
    if (phone) {
      const existingUser = await prisma.user.findFirst({
        where: {
          phone,
          NOT: {
            id: currentUser.id
          }
        }
      })

      if (existingUser) {
        return {
          success: false,
          error: '该手机号已被使用'
        }
      }
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone })
      }
    })

    // 更新token
    const userPayload: UserPayload = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name || undefined,
      phone: updatedUser.phone || undefined
    }

    const token = await createToken(userPayload)
    await setAuthCookie(token)

    revalidatePath('/')

    return {
      success: true,
      message: '资料更新成功',
      user: userPayload
    }

  } catch (error) {
    console.error('更新用户资料失败:', error)
    return {
      success: false,
      error: '更新失败，请稍后重试'
    }
  }
} 