import Stripe from 'stripe'
import { loadStripe, type Stripe as StripeJS } from '@stripe/stripe-js'

// ===========================================
// Stripe 配置
// ===========================================

/**
 * Stripe 服务端实例
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  appInfo: {
    name: 'Fragrance Commerce',
    version: '1.0.0',
  },
})

/**
 * Stripe 客户端实例
 */
let stripePromise: Promise<StripeJS | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// ===========================================
// Stripe 工具函数
// ===========================================

/**
 * 格式化金额为 Stripe 格式（分为单位）
 */
export function formatAmountForStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

/**
 * 格式化 Stripe 金额为显示格式
 */
export function formatAmountFromStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  
  return zeroDecimalCurrency ? amount : amount / 100
}

/**
 * 创建支付意图
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'cny',
  metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount, currency),
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    })
    
    return paymentIntent
  } catch (error) {
    console.error('创建支付意图失败:', error)
    throw new Error('创建支付失败')
  }
}

/**
 * 确认支付
 */
export async function confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('确认支付失败:', error)
    throw new Error('确认支付失败')
  }
}

/**
 * 获取支付意图
 */
export async function retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('获取支付意图失败:', error)
    throw new Error('获取支付信息失败')
  }
} 