'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { CartItem } from '@/lib/cart-context'
import { PaymentMethod, OrderStatus } from '@prisma/client'

// 创建订单的数据类型
export interface CreateOrderData {
  items: CartItem[]
  shippingAddress: {
    id: string
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
  }
  paymentMethod: string
  deliveryMethod: string
  deliveryFee: number
  discountAmount?: number
  orderNote?: string
  userId: number // 用户ID
}

// 订单创建结果类型
export interface OrderResult {
  success: boolean
  data?: {
    orderId: number
    orderNo: string
    totalAmount: number
  }
  error?: string
}

/**
 * 生成订单号
 */
function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const timestamp = Date.now().toString().slice(-6) // 取最后6位时间戳
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  
  return `ORD${year}${month}${day}${timestamp}${random}`
}

/**
 * 映射支付方式字符串到数据库枚举
 */
function mapPaymentMethod(paymentMethod: string): PaymentMethod {
  switch (paymentMethod) {
    case 'wechat':
    case '微信支付':
      return PaymentMethod.WECHAT_PAY
    case 'alipay':  
    case '支付宝':
      return PaymentMethod.ALIPAY
    case 'bank':
    case '银行卡':
      return PaymentMethod.BANK_CARD
    case 'stripe':
    case 'Stripe支付':
      return PaymentMethod.STRIPE
    default:
      return PaymentMethod.BANK_CARD
  }
}

/**
 * 创建订单
 */
export async function createOrder(data: CreateOrderData): Promise<OrderResult> {
  try {
    // 验证必要数据
    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        error: '购物车为空'
      }
    }

    if (!data.shippingAddress.id) {
      return {
        success: false,
        error: '请选择收货地址'
      }
    }

    // 开始数据库事务
    const result = await prisma.$transaction(async (tx) => {
      // 1. 查找或创建地址记录
      let addressRecord = await tx.address.findFirst({
        where: {
          userId: data.userId,
          name: data.shippingAddress.name,
          phone: data.shippingAddress.phone,
          province: data.shippingAddress.province,
          city: data.shippingAddress.city,
          district: data.shippingAddress.district,
          detail: data.shippingAddress.detail
        }
      })

      // 如果地址不存在，创建新地址
      if (!addressRecord) {
        addressRecord = await tx.address.create({
          data: {
            userId: data.userId,
            name: data.shippingAddress.name,
            phone: data.shippingAddress.phone,
            province: data.shippingAddress.province,
            city: data.shippingAddress.city,
            district: data.shippingAddress.district,
            detail: data.shippingAddress.detail,
            isDefault: false
          }
        })
      }

      // 2. 验证商品库存和价格
      const productIds = data.items.map(item => parseInt(item.id))
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true
        }
      })

      if (products.length !== data.items.length) {
        throw new Error('部分商品不存在或已下架')
      }

      // 验证库存
      for (const item of data.items) {
        const product = products.find(p => p.id === parseInt(item.id))
        if (!product) {
          throw new Error(`商品 ${item.name} 不存在`)
        }
        if (product.stock < item.quantity) {
          throw new Error(`商品 ${item.name} 库存不足，当前库存：${product.stock}`)
        }
      }

      // 3. 计算订单金额
      const subtotal = data.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)

      const totalAmount = subtotal + data.deliveryFee - (data.discountAmount || 0)

      // 4. 创建订单
      const orderNo = generateOrderNumber()
      
      const order = await tx.order.create({
        data: {
          orderNo,
          userId: data.userId,
          addressId: addressRecord.id, // 使用数据库地址记录的ID
          subtotal: subtotal,
          shippingFee: data.deliveryFee,
          discountAmount: data.discountAmount || 0,
          totalAmount: totalAmount,
          status: OrderStatus.PENDING,
          paymentMethod: mapPaymentMethod(data.paymentMethod),
          shippingMethod: data.deliveryMethod,
          remark: data.orderNote,
        }
      })

      // 5. 创建订单项
      for (const item of data.items) {
        const product = products.find(p => p.id === parseInt(item.id))!
        
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: parseInt(item.id),
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity
          }
        })

        // 扣减库存
        await tx.product.update({
          where: { id: parseInt(item.id) },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      // 6. 创建支付记录
      await tx.payment.create({
        data: {
          orderId: order.id,
          paymentNo: `PAY${orderNo}`,
          amount: totalAmount,
          method: mapPaymentMethod(data.paymentMethod),
          status: 'PENDING'
        }
      })

      return {
        orderId: order.id,
        orderNo: order.orderNo,
        totalAmount: Number(totalAmount)
      }
    })

    // 重新验证相关页面
    revalidatePath('/orders')
    revalidatePath('/cart')

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('创建订单失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '创建订单失败'
    }
  }
}

/**
 * 获取用户订单列表
 */
export async function getUserOrders(userId: number) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        address: true,
        orderItems: {
          include: {
            product: true
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      data: JSON.parse(JSON.stringify(orders))
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return {
      success: false,
      error: '获取订单列表失败'
    }
  }
}

/**
 * 取消订单
 */
export async function cancelOrder(orderId: number, userId: number) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
        status: 'PENDING' // 只有待付款订单可以取消
      },
      include: {
        orderItems: true
      }
    })

    if (!order) {
      return {
        success: false,
        error: '订单不存在或无法取消'
      }
    }

    // 使用事务取消订单
    await prisma.$transaction(async (tx) => {
      // 更新订单状态
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      })

      // 恢复库存
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }

      // 更新支付状态
      await tx.payment.updateMany({
        where: { orderId },
        data: {
          status: 'CANCELLED'
        }
      })
    })

    revalidatePath('/orders')

    return {
      success: true,
      message: '订单已取消'
    }
  } catch (error) {
    console.error('取消订单失败:', error)
    return {
      success: false,
      error: '取消订单失败'
    }
  }
} 