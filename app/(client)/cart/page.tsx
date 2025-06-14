"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { AddressSelector } from "@/components/address-selector"
import { useState } from "react"

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const [selectedPayment, setSelectedPayment] = useState("wechat")
  const [showCheckout, setShowCheckout] = useState(false)

  // 配送费用
  const deliveryPrice = 0 // 免费配送
  const totalPrice = state.totalPrice + deliveryPrice

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-8">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">购物车空空如也</h1>
            <p className="text-gray-600 mb-8">
              还没有添加任何商品，快去探索我们的精选商品吧！
            </p>
            <Link href="/categories/all">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
                开始购物
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Your cart</h1>
          <div className="flex items-center space-x-4">
            <Link href="/categories/all">
              <Button variant="ghost" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                继续购物
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清空
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
          {/* 左侧商品列表 */}
          <div className="xl:col-span-3">
            {/* 表格头部 */}
            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 mb-6">
              <div className="col-span-6 text-sm font-medium text-gray-700 uppercase tracking-wider">
                Product
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wider text-center">
                Price
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wider text-center">
                Quantity
              </div>
              <div className="col-span-2 text-sm font-medium text-gray-700 uppercase tracking-wider text-right">
                Total
              </div>
            </div>

            {/* 商品列表 */}
            <div className="space-y-8">
              {state.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100">
                  {/* 商品信息 */}
                  <div className="col-span-6 flex items-center space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">{item.brand}</p>
                    </div>
                  </div>

                  {/* 价格 */}
                  <div className="col-span-2 text-center">
                    <span className="text-lg font-medium text-gray-900">
                      ¥{item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* 数量控制 */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 p-0 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="px-3 py-1 min-w-[40px] text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0 hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* 小计 */}
                  <div className="col-span-2 text-right">
                    <span className="text-lg font-medium text-gray-900">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="ml-2 text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧结算信息 */}
          <div className="xl:col-span-2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Checkout</h2>
              
              {/* 地址选择 */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  配送地址
                </label>
                <AddressSelector />
              </div>

              {/* 支付方式 */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  支付方式
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="wechat"
                      checked={selectedPayment === "wechat"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">微信支付</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="alipay"
                      checked={selectedPayment === "alipay"}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">支付宝</span>
                  </label>
                </div>
              </div>

              {/* 费用明细 */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">商品小计</span>
                  <span className="text-gray-900">¥{state.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">配送费</span>
                  <span className="text-green-600">免费</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">TOTAL</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ¥{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 结算按钮 */}
              <Link href="/checkout">
                <Button className="w-full bg-black text-white hover:bg-gray-800 h-12">
                  立即结算
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}