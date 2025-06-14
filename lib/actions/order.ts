'use server'

import { revalidatePath } from 'next/cache'

// 导入类型（从购物车页面临时导入，后续应该移到 types.ts）
type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
type PaymentStatus = 'unpaid' | 'paying' | 'paid' | 'failed' | 'cancelled' | 'refunded'

interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  imageUrl: string
  quantity: number
  inStock: boolean
  maxQuantity?: number
}

interface Address {
  id: string
  userId: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

interface OrderItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  imageUrl: string
  quantity: number
  subtotal: number
}

interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  deliveryFee: number
  discountAmount: number
  finalAmount: number
  items: OrderItem[]
  shippingAddress: Address
  paymentMethod: string
  deliveryMethod: string
  orderNote?: string
  paymentIntentId?: string
  createdAt: Date
  updatedAt: Date
}

interface CreateOrderData {
  items: CartItem[]
  shippingAddress: Address
  paymentMethod: string
  deliveryMethod: string
  deliveryFee: number
  discountAmount?: number
  orderNote?: string
}

// 模拟订单存储（在实际应用中应该使用数据库）
const orders: Order[] = []

/**
 * 创建订单
 */
export async function createOrder(data: CreateOrderData): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    // 生成订单号
    const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    // 计算订单金额
    const totalAmount = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const finalAmount = totalAmount + data.deliveryFee - (data.discountAmount || 0)
    
    // 创建订单对象
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber,
      status: 'pending',
      paymentStatus: 'unpaid',
      totalAmount,
      deliveryFee: data.deliveryFee,
      discountAmount: data.discountAmount || 0,
      finalAmount,
      items: data.items.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        originalPrice: item.originalPrice,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      deliveryMethod: data.deliveryMethod,
      orderNote: data.orderNote,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // 保存订单（在实际应用中保存到数据库）
    orders.push(order)
    
    console.log('订单创建成功:', order.orderNumber)
    
    // 重新验证相关页面
    revalidatePath('/orders')
    
    return { success: true, order }
  } catch (error) {
    console.error('创建订单失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '创建订单失败'
    }
  }
}

/**
 * 更新订单状态
 */
export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus, 
  paymentStatus?: PaymentStatus,
  paymentIntentId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const orderIndex = orders.findIndex(order => order.id === orderId)
    
    if (orderIndex === -1) {
      throw new Error('订单不存在')
    }
    
    orders[orderIndex].status = status
    if (paymentStatus) {
      orders[orderIndex].paymentStatus = paymentStatus
    }
    if (paymentIntentId) {
      orders[orderIndex].paymentIntentId = paymentIntentId
    }
    orders[orderIndex].updatedAt = new Date()
    
    console.log(`订单 ${orderId} 状态更新为: ${status}`)
    
    // 重新验证相关页面
    revalidatePath('/orders')
    revalidatePath(`/order-confirm/${orderId}`)
    
    return { success: true }
  } catch (error) {
    console.error('更新订单状态失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '更新订单状态失败'
    }
  }
}

/**
 * 获取订单详情
 */
export async function getOrder(orderId: string): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const order = orders.find(order => order.id === orderId)
    
    if (!order) {
      throw new Error('订单不存在')
    }
    
    return { success: true, order }
  } catch (error) {
    console.error('获取订单失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '获取订单失败'
    }
  }
}

/**
 * 获取所有订单（用于订单列表页面）
 */
export async function getAllOrders(): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
  try {
    // 按创建时间倒序排列
    const sortedOrders = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    return { success: true, orders: sortedOrders }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '获取订单列表失败'
    }
  }
} 