'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { PaymentMethod } from '@prisma/client'

// 支付结果类型
export interface PaymentResult {
  success: boolean
  data?: {
    paymentUrl?: string
    paymentId?: string
    qrCode?: string
    message?: string
  }
  error?: string
}

/**
 * 微信支付
 */
export async function processWechatPayment(orderId: number, amount: number): Promise<PaymentResult> {
  try {
    // 模拟微信支付API调用
    console.log(`处理微信支付: 订单ID ${orderId}, 金额 ${amount}`)
    
    // 这里应该调用微信支付API
    // const wechatResult = await wechatPayAPI.createOrder({...})
    
    // 模拟返回微信支付二维码
    const mockQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wxpay_${orderId}_${Date.now()}`
    
    // 更新支付记录状态为处理中
    await prisma.payment.updateMany({
      where: { orderId },
      data: { status: 'PENDING' }
    })
    
    return {
      success: true,
      data: {
        qrCode: mockQrCode,
        message: '请使用微信扫码支付'
      }
    }
  } catch (error) {
    console.error('微信支付失败:', error)
    return {
      success: false,
      error: '微信支付处理失败'
    }
  }
}

/**
 * 支付宝支付
 */
export async function processAlipayPayment(orderId: number, amount: number): Promise<PaymentResult> {
  try {
    // 模拟支付宝支付API调用
    console.log(`处理支付宝支付: 订单ID ${orderId}, 金额 ${amount}`)
    
    // 这里应该调用支付宝支付API
    // const alipayResult = await alipayAPI.createOrder({...})
    
    // 模拟返回支付宝支付链接
    const mockPaymentUrl = `https://openapi.alipay.com/gateway.do?mock_order_${orderId}_${Date.now()}`
    
    // 更新支付记录状态为处理中
    await prisma.payment.updateMany({
      where: { orderId },
      data: { status: 'PENDING' }
    })
    
    return {
      success: true,
      data: {
        paymentUrl: mockPaymentUrl,
        message: '正在跳转到支付宝支付页面'
      }
    }
  } catch (error) {
    console.error('支付宝支付失败:', error)
    return {
      success: false,
      error: '支付宝支付处理失败'
    }
  }
}

/**
 * 银行卡支付
 */
export async function processBankCardPayment(orderId: number, amount: number): Promise<PaymentResult> {
  try {
    // 模拟银行卡支付API调用
    console.log(`处理银行卡支付: 订单ID ${orderId}, 金额 ${amount}`)
    
    // 这里应该调用银行支付网关API
    // const bankResult = await bankPaymentAPI.createOrder({...})
    
    // 模拟返回银行支付页面链接
    const mockPaymentUrl = `https://payment.bank.com/pay?order=${orderId}&amount=${amount}&timestamp=${Date.now()}`
    
    // 更新支付记录状态为处理中
    await prisma.payment.updateMany({
      where: { orderId },
      data: { status: 'PENDING' }
    })
    
    return {
      success: true,
      data: {
        paymentUrl: mockPaymentUrl,
        message: '正在跳转到银行支付页面'
      }
    }
  } catch (error) {
    console.error('银行卡支付失败:', error)
    return {
      success: false,
      error: '银行卡支付处理失败'
    }
  }
}

/**
 * Stripe支付
 */
export async function processStripePayment(orderId: number, amount: number): Promise<PaymentResult> {
  try {
    // 调用Stripe Checkout会话创建
    console.log(`处理Stripe支付: 订单ID ${orderId}, 金额 ${amount}`)
    
    // 导入createCheckoutSession函数
    const { createCheckoutSession } = await import('./stripe')
    
    // 创建Stripe Checkout会话
    const result = await createCheckoutSession({
      orderId: orderId.toString(),
      amount: amount,
      currency: 'cny',
      description: `订单 ${orderId} 支付`,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-success?orderNumber=${orderId}&payment=stripe`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders`
    })
    
    if (result.success && result.url) {
      // 更新支付记录状态为处理中
      await prisma.payment.updateMany({
        where: { orderId },
        data: { 
          status: 'PENDING',
          thirdPartyId: result.sessionId
        }
      })
      
      return {
        success: true,
        data: {
          paymentUrl: result.url,
          paymentId: result.sessionId,
          message: '正在跳转到Stripe支付页面'
        }
      }
    } else {
      throw new Error(result.error || 'Stripe会话创建失败')
    }
  } catch (error) {
    console.error('Stripe支付失败:', error)
    return {
      success: false,
      error: 'Stripe支付处理失败'
    }
  }
}

/**
 * 余额支付
 */
export async function processBalancePayment(orderId: number, amount: number, userId: number): Promise<PaymentResult> {
  try {
    // 模拟余额支付逻辑
    console.log(`处理余额支付: 订单ID ${orderId}, 金额 ${amount}, 用户ID ${userId}`)
    
    // 这里应该检查用户余额并扣款
    // const user = await prisma.user.findUnique({ where: { id: userId } })
    // if (!user || user.balance < amount) {
    //   return { success: false, error: '余额不足' }
    // }
    
    // 模拟余额充足，直接完成支付
    await prisma.$transaction(async (tx) => {
      // 更新订单状态为已支付
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'PAID' }
      })
      
      // 更新支付记录状态为成功
      await tx.payment.updateMany({
        where: { orderId },
        data: { 
          status: 'SUCCESS',
          paidAt: new Date()
        }
      })
    })
    
    revalidatePath('/orders')
    
    return {
      success: true,
      data: {
        message: '余额支付成功'
      }
    }
  } catch (error) {
    console.error('余额支付失败:', error)
    return {
      success: false,
      error: '余额支付处理失败'
    }
  }
}

/**
 * 统一支付处理入口
 */
export async function processPayment(
  orderId: number, 
  paymentMethod: PaymentMethod, 
  amount: number, 
  userId: number
): Promise<PaymentResult> {
  try {
    // 验证订单状态
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
        status: 'PENDING'
      }
    })
    
    if (!order) {
      return {
        success: false,
        error: '订单不存在或状态异常'
      }
    }
    
    // 根据支付方式调用对应的处理函数
    switch (paymentMethod) {
      case PaymentMethod.WECHAT_PAY:
        return await processWechatPayment(orderId, amount)
      
      case PaymentMethod.ALIPAY:
        return await processAlipayPayment(orderId, amount)
      
      case PaymentMethod.BANK_CARD:
        return await processBankCardPayment(orderId, amount)
      
      // case PaymentMethod.STRIPE:
      //   return await processStripePayment(orderId, amount)
      
      case PaymentMethod.BALANCE:
        return await processBalancePayment(orderId, amount, userId)
      
      default:
        // 如果是STRIPE或其他未识别的支付方式，使用Stripe处理
        if (paymentMethod === 'STRIPE') {
          return await processStripePayment(orderId, amount)
        }
        return {
          success: false,
          error: '不支持的支付方式'
        }
    }
  } catch (error) {
    console.error('支付处理失败:', error)
    return {
      success: false,
      error: '支付处理失败'
    }
  }
} 