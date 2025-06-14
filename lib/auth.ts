'use server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// 用户 payload 类型
export interface UserPayload {
  id: number
  email: string
  name?: string
  phone?: string
}

// 简单的密码哈希（生产环境建议使用bcrypt）
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

// 验证密码
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

// 创建简单的session token
export async function createToken(payload: UserPayload): Promise<string> {
  const tokenData = {
    ...payload,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7天过期
  }
  return Buffer.from(JSON.stringify(tokenData)).toString('base64')
}

// 验证token
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    if (decoded.exp < Date.now()) {
      return null // token已过期
    }
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      phone: decoded.phone
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// 设置认证 cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

// 获取认证 cookie
export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')
  return token?.value || null
}

// 删除认证 cookie
export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// 获取当前用户
export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const token = await getAuthCookie()
    if (!token) return null
    
    return await verifyToken(token)
  } catch (error) {
    console.error('Get current user failed:', error)
    return null
  }
}
