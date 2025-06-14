'use server'

import { createPaymentIntent, formatAmountForStripe, stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

// ===========================================
// 支付相关类型
// ===========================================

export interface PaymentData {
  orderId: string
  amount: number
  currency?: string
  description?: string
}

export interface PaymentResult {
  success: boolean
  paymentIntentId?: string
  clientSecret?: string
  error?: string
}

// ===========================================
// 支付 Actions
// ===========================================
// ... existing code ...

/**
 * 创建 Stripe Checkout 会话
 */
export async function createCheckoutSession(data: {
  orderId: string
  amount: number
  currency?: string
  description?: string
  successUrl: string
  cancelUrl: string
}): Promise<{
  success: boolean
  url?: string
  sessionId?: string
  error?: string
}> {
  try {
    const { orderId, amount, currency = 'cny', description, successUrl, cancelUrl } = data

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: description || `订单 ${orderId}`,
              description: `订单号: ${orderId}`,
            },
            unit_amount: formatAmountForStripe(amount, currency),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId,
      },
    })

    return {
      success: true,
      url: session.url!,
      sessionId: session.id,
    }
  } catch (error) {
    console.error('创建 Checkout 会话失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '创建支付会话失败',
    }
  }
}

/**
 * 创建支付意图
 */
export async function createOrderPayment(data: PaymentData): Promise<PaymentResult> {
  try {
    const { orderId, amount, currency = 'cny', description } = data

    // 创建支付意图
    const paymentIntent = await createPaymentIntent(
      amount,
      currency,
      {
        orderId,
        description: description || `订单 ${orderId} 支付`,
      }
    )

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
    }
  } catch (error) {
    console.error('创建支付失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '创建支付失败',
    }
  }
}

/**
 * 处理支付成功
 */
export async function handlePaymentSuccess(
  paymentIntentId: string,
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 验证支付状态
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('支付未成功')
    }

    // 这里应该更新数据库中的订单状态
    // 由于我们使用模拟数据，这里只是示例
    console.log(`订单 ${orderId} 支付成功，支付意图ID: ${paymentIntentId}`)
    
    // 重新验证订单页面
    revalidatePath('/orders')
    
    return { success: true }
  } catch (error) {
    console.error('处理支付成功回调失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '处理支付失败',
    }
  }
}

/**
 * 处理支付失败
 */
export async function handlePaymentFailure(
  paymentIntentId: string,
  orderId: string,
  errorMessage?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 记录支付失败
    console.log(`订单 ${orderId} 支付失败，支付意图ID: ${paymentIntentId}，错误: ${errorMessage}`)
    
    // 这里可以更新数据库记录支付失败状态
    
    return { success: true }
  } catch (error) {
    console.error('处理支付失败回调失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '处理支付失败回调失败',
    }
  }
}

/**
 * 取消支付
 */
export async function cancelPayment(
  paymentIntentId: string,
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 取消支付意图
    await stripe.paymentIntents.cancel(paymentIntentId)
    
    console.log(`订单 ${orderId} 支付已取消，支付意图ID: ${paymentIntentId}`)
    
    return { success: true }
  } catch (error) {
    console.error('取消支付失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '取消支付失败',
    }
  }
}

/**
 * 处理Stripe Checkout成功
 */
export async function handleCheckoutSuccess(
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 获取Checkout会话信息
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status !== 'paid') {
      throw new Error('支付未完成')
    }

    const orderId = session.metadata?.orderId
    if (!orderId) {
      throw new Error('订单ID不存在')
    }

    // 更新数据库中的订单和支付状态
    const { prisma } = await import('@/lib/prisma')
    const { PaymentMethod } = await import('@prisma/client')
    
    // 检查订单是否已经处理过（避免重复处理）
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        payments: {
          where: { 
            method: PaymentMethod.STRIPE,
            status: 'SUCCESS'
          }
        }
      }
    })

    // 如果订单已经是已支付状态，直接返回成功
    if (existingOrder?.status === 'PAID' && existingOrder.payments.length > 0) {
      console.log(`订单 ${orderId} 已经处理过，跳过重复处理`)
      return { success: true }
    }
    
    await prisma.$transaction(async (tx) => {
      // 更新订单状态为已支付
      await tx.order.update({
        where: { id: parseInt(orderId) },
        data: { 
          status: 'PAID',
          updatedAt: new Date()
        }
      })
      
      // 更新支付记录状态为成功
      await tx.payment.updateMany({
        where: { 
          orderId: parseInt(orderId),
          method: PaymentMethod.STRIPE
        },
        data: { 
          status: 'SUCCESS',
          paidAt: new Date(),
          thirdPartyId: sessionId,
          thirdPartyNo: session.payment_intent as string,
          updatedAt: new Date()
        }
      })
    })
    
    console.log(`Stripe Checkout成功: 订单ID ${orderId}, 会话ID: ${sessionId}`)
    
    // 重新验证订单页面
    revalidatePath('/orders')
    
    return { success: true }
  } catch (error) {
    console.error('处理Stripe Checkout成功回调失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '处理支付成功失败',
    }
  }
} 