import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { PaymentMethod } from '@prisma/client'

// Stripe Webhook端点密钥
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('缺少Stripe签名')
      return NextResponse.json({ error: '缺少签名' }, { status: 400 })
    }

    // 验证webhook签名
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook签名验证失败:', err)
      return NextResponse.json({ error: '签名验证失败' }, { status: 400 })
    }

    console.log('收到Stripe Webhook事件:', event.type)

    // 处理不同类型的事件
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        // 处理订阅支付成功（如果有订阅功能）
        console.log('订阅支付成功:', event.data.object.id)
        break
      
      default:
        console.log('未处理的事件类型:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook处理失败:', error)
    return NextResponse.json(
      { error: 'Webhook处理失败' }, 
      { status: 500 }
    )
  }
}

/**
 * 处理Checkout会话完成事件
 */
async function handleCheckoutSessionCompleted(session: any) {
  try {
    console.log('处理Checkout会话完成:', session.id)
    
    const orderId = session.metadata?.orderId
    if (!orderId) {
      console.error('Checkout会话缺少订单ID:', session.id)
      return
    }

    // 检查支付状态
    if (session.payment_status === 'paid') {
      await updateOrderPaymentStatus(
        parseInt(orderId),
        'SUCCESS',
        session.id,
        session.payment_intent
      )
      console.log(`订单 ${orderId} 支付成功 (Checkout)`)
    } else {
      console.log(`订单 ${orderId} 支付状态: ${session.payment_status}`)
    }
  } catch (error) {
    console.error('处理Checkout会话完成失败:', error)
  }
}

/**
 * 处理PaymentIntent成功事件
 */
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log('处理PaymentIntent成功:', paymentIntent.id)
    
    // 从PaymentIntent的metadata中获取订单ID
    const orderId = paymentIntent.metadata?.orderId
    if (!orderId) {
      console.error('PaymentIntent缺少订单ID:', paymentIntent.id)
      return
    }

    await updateOrderPaymentStatus(
      parseInt(orderId),
      'SUCCESS',
      paymentIntent.id,
      paymentIntent.id
    )
    console.log(`订单 ${orderId} 支付成功 (PaymentIntent)`)
  } catch (error) {
    console.error('处理PaymentIntent成功失败:', error)
  }
}

/**
 * 处理PaymentIntent失败事件
 */
async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    console.log('处理PaymentIntent失败:', paymentIntent.id)
    
    const orderId = paymentIntent.metadata?.orderId
    if (!orderId) {
      console.error('PaymentIntent缺少订单ID:', paymentIntent.id)
      return
    }

    await updateOrderPaymentStatus(
      parseInt(orderId),
      'FAILED',
      paymentIntent.id,
      paymentIntent.id
    )
    console.log(`订单 ${orderId} 支付失败`)
  } catch (error) {
    console.error('处理PaymentIntent失败失败:', error)
  }
}

/**
 * 更新订单支付状态
 */
async function updateOrderPaymentStatus(
  orderId: number,
  status: 'SUCCESS' | 'FAILED',
  thirdPartyId: string,
  thirdPartyNo: string
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 更新订单状态
      const orderStatus = status === 'SUCCESS' ? 'PAID' : 'PENDING'
      await tx.order.update({
        where: { id: orderId },
        data: { 
          status: orderStatus,
          updatedAt: new Date()
        }
      })
      
      // 更新支付记录状态 - 使用字符串而不是枚举
      await tx.payment.updateMany({
        where: { 
          orderId: orderId,
          method: 'STRIPE' as PaymentMethod
        },
        data: { 
          status: status,
          thirdPartyId: thirdPartyId,
          thirdPartyNo: thirdPartyNo,
          paidAt: status === 'SUCCESS' ? new Date() : null,
          updatedAt: new Date()
        }
      })
    })
    
    console.log(`订单 ${orderId} 状态已更新为: ${status}`)
  } catch (error) {
    console.error('更新订单支付状态失败:', error)
    throw error
  }
} 