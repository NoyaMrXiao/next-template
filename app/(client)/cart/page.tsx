"use client"

import { CartItem, useCart } from "@/lib/cart-context"
import { useState } from "react"
import { Address } from "@prisma/client"
import {
  EmptyCart,
  CartHeader,
  CartItemsList,
  CheckoutSummary
} from "@/components/cart"

// 在 Address 接口后添加订单相关类型
/**
 * 订单状态
 */
export type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

/**
 * 支付状态
 */
export type PaymentStatus = 'unpaid' | 'paying' | 'paid' | 'failed' | 'cancelled' | 'refunded'

/**
 * 订单商品项
 */
export interface OrderItem {
    id: string
    name: string
    brand: string
    price: number
    originalPrice?: number
    imageUrl: string
    quantity: number
    subtotal: number
}

/**
 * 订单信息
 */
export interface Order {
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

/**
 * 创建订单数据
 */
export interface CreateOrderData {
    items: CartItem[]
    shippingAddress: Address
    paymentMethod: string
    deliveryMethod: string
    deliveryFee: number
    discountAmount?: number
    orderNote?: string
}

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const [selectedPayment, setSelectedPayment] = useState("wechat")

  // 配送费用
  const deliveryPrice = 0 // 免费配送
  const totalPrice = state.totalPrice + deliveryPrice

  if (state.items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader onClearCart={clearCart} />

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
          <CartItemsList
            items={state.items}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />

          <CheckoutSummary
            subtotal={state.totalPrice}
            deliveryFee={deliveryPrice}
            total={totalPrice}
            selectedPayment={selectedPayment}
            onPaymentChange={setSelectedPayment}
          />
        </div>
      </div>
    </div>
  )
}