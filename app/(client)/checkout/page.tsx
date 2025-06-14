"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Truck, 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Gift,
  Tag,
  FileText,
  Phone,
  Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { useAddress } from "@/hooks/use-address"
import { AddressSelector } from "@/components/address-selector"
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useCart()
  const { getSelectedAddress } = useAddress()
  
  const [selectedPayment, setSelectedPayment] = useState(0)
  const [selectedDelivery, setSelectedDelivery] = useState(0)
  const [orderNote, setOrderNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null)

  // 如果购物车为空，重定向到购物车页面
  useEffect(() => {
    if (state.items.length === 0) {
      router.push('/cart')
    }
  }, [state.items.length, router])

  // 支付方式
  const paymentMethods = [
    { 
      id: 1, 
      name: "微信支付", 
      icon: "💚", 
      desc: "推荐使用，支持花呗分期",
      fee: 0,
      discount: 0
    },
    { 
      id: 2, 
      name: "支付宝", 
      icon: "🔵", 
      desc: "安全便捷，支持余额宝支付",
      fee: 0,
      discount: 0.02 // 2%折扣
    },
    { 
      id: 3, 
      name: "银行卡", 
      icon: "💳", 
      desc: "储蓄卡/信用卡，部分银行有优惠",
      fee: 0,
      discount: 0
    }
  ]

  // 配送方式
  const deliveryMethods = [
    { 
      id: 1, 
      name: "标准配送", 
      time: "3-5个工作日", 
      price: 0, 
      desc: "免费配送，工作日配送",
      icon: "📦"
    },
    { 
      id: 2, 
      name: "次日达", 
      time: "次日送达", 
      price: 15, 
      desc: "加急配送，限工作日下单",
      icon: "🚚"
    },
    { 
      id: 3, 
      name: "当日达", 
      time: "当日送达", 
      price: 25, 
      desc: "限部分地区，12点前下单",
      icon: "⚡"
    }
  ]

  // 优惠券数据
  const availableCoupons = [
    {
      id: "WELCOME10",
      name: "新用户专享",
      desc: "满199减20",
      discount: 20,
      minAmount: 199,
      type: "amount"
    },
    {
      id: "SAVE5",
      name: "限时优惠",
      desc: "全场95折",
      discount: 0.05,
      minAmount: 100,
      type: "percent"
    },
    {
      id: "FREE_SHIP",
      name: "包邮券",
      desc: "免配送费",
      discount: 0,
      minAmount: 0,
      type: "shipping"
    }
  ]

  const selectedAddress = getSelectedAddress()
  const deliveryPrice = deliveryMethods[selectedDelivery].price
  const paymentDiscount = paymentMethods[selectedPayment].discount || 0
  
  // 计算优惠
  let couponDiscount = 0
  if (selectedCoupon) {
    const coupon = availableCoupons.find(c => c.id === selectedCoupon)
    if (coupon && state.totalPrice >= coupon.minAmount) {
      if (coupon.type === "amount") {
        couponDiscount = coupon.discount
      } else if (coupon.type === "percent") {
        couponDiscount = state.totalPrice * coupon.discount
      } else if (coupon.type === "shipping") {
        couponDiscount = deliveryPrice
      }
    }
  }

  const paymentDiscountAmount = state.totalPrice * paymentDiscount
  const finalDeliveryPrice = selectedCoupon === "FREE_SHIP" ? 0 : deliveryPrice
  const totalPrice = state.totalPrice + finalDeliveryPrice - couponDiscount - paymentDiscountAmount

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      toast.error('请选择收货地址')
      return
    }

    setIsSubmitting(true)

    try {
      // 模拟订单提交
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 生成订单号
      const orderNumber = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      
      toast.success('订单提交成功！')
      
      // 清空购物车
      clearCart()
      
      // 跳转到订单成功页面
      router.push(`/order-success?orderNumber=${orderNumber}`)
      
    } catch (error) {
      toast.error('订单提交失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (state.items.length === 0) {
    return null // 避免闪烁，useEffect会处理重定向
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">确认订单</h1>
              <p className="text-gray-600 mt-1">请仔细核对订单信息，确认无误后提交订单</p>
            </div>
          </div>
          
          {/* 订单进度 */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-400">
              <Package className="w-4 h-4 mr-1" />
              购物车
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center text-rose-500 font-medium">
              <CheckCircle className="w-4 h-4 mr-1" />
              确认订单
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center text-gray-400">
              <CreditCard className="w-4 h-4 mr-1" />
              支付完成
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 左侧内容 */}
          <div className="xl:col-span-2 space-y-6">
            {/* 商品清单 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Package className="w-5 h-5 mr-2 text-rose-500" />
                  商品清单 ({state.totalItems}件)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                      <Badge className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                        {item.quantity}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-rose-500 font-semibold">¥{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">¥{item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ¥{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 收货地址 */}
            <AddressSelector />

            {/* 配送方式 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Truck className="w-5 h-5 mr-2 text-rose-500" />
                  配送方式
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {deliveryMethods.map((method, index) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedDelivery === index
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedDelivery(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedDelivery === index
                            ? 'border-rose-500 bg-rose-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedDelivery === index && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                        <span className="text-xl">{method.icon}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{method.name}</span>
                            <span className="text-sm text-gray-500">({method.time})</span>
                          </div>
                          <p className="text-sm text-gray-600">{method.desc}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {method.price === 0 ? '免费' : `¥${method.price}`}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 支付方式 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CreditCard className="w-5 h-5 mr-2 text-rose-500" />
                  支付方式
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method, index) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedPayment === index
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPayment(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPayment === index
                            ? 'border-rose-500 bg-rose-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedPayment === index && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{method.name}</span>
                            {method.discount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {(method.discount * 100).toFixed(0)}%优惠
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{method.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 优惠券 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Gift className="w-5 h-5 mr-2 text-rose-500" />
                  优惠券
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableCoupons.map((coupon) => {
                  const canUse = state.totalPrice >= coupon.minAmount
                  const isSelected = selectedCoupon === coupon.id
                  
                  return (
                    <div
                      key={coupon.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50'
                          : canUse 
                            ? 'border-gray-200 hover:border-gray-300'
                            : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      }`}
                      onClick={() => canUse && setSelectedCoupon(isSelected ? null : coupon.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            isSelected
                              ? 'border-rose-500 bg-rose-500'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <Tag className={`w-4 h-4 ${canUse ? 'text-orange-500' : 'text-gray-400'}`} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`font-semibold ${canUse ? 'text-gray-900' : 'text-gray-400'}`}>
                                {coupon.name}
                              </span>
                              {!canUse && (
                                <Badge variant="outline" className="text-xs text-gray-400">
                                  不满足条件
                                </Badge>
                              )}
                            </div>
                            <p className={`text-sm ${canUse ? 'text-gray-600' : 'text-gray-400'}`}>
                              {coupon.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* 订单备注 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-rose-500" />
                  订单备注
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="orderNote" className="text-sm text-gray-600 mb-2 block">
                  如有特殊要求，请在此说明（选填）
                </Label>
                <Textarea
                  id="orderNote"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="例如：请在工作日配送、放在门卫处等"
                  className="resize-none"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* 右侧订单摘要 */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* 订单摘要 */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Package className="w-5 h-5 mr-2 text-rose-500" />
                    订单摘要
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">商品数量</span>
                      <span className="font-semibold text-gray-900">{state.totalItems} 件</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">商品总价</span>
                      <span className="font-semibold text-gray-900">¥{state.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">配送费用</span>
                      <span className={`font-semibold ${finalDeliveryPrice === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {finalDeliveryPrice === 0 ? '免费' : `¥${finalDeliveryPrice}`}
                      </span>
                    </div>
                    
                    {/* 优惠明细 */}
                    {couponDiscount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>优惠券优惠</span>
                        <span>-¥{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {paymentDiscountAmount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>支付优惠</span>
                        <span>-¥{paymentDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">应付总额</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-rose-500">
                          ¥{totalPrice.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500">含税</p>
                      </div>
                    </div>
                  </div>

                  {/* 预计送达时间 */}
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center text-blue-700 text-sm mb-1">
                      <Clock className="w-4 h-4 mr-2" />
                      预计送达时间
                    </div>
                    <p className="text-blue-600 font-medium">
                      {deliveryMethods[selectedDelivery].time}
                    </p>
                  </div>

                  {/* 提交订单按钮 */}
                  <Button 
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting || !selectedAddress}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '提交中...' : `提交订单 ¥${totalPrice.toFixed(2)}`}
                  </Button>

                  {!selectedAddress && (
                    <div className="flex items-center text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      请先选择收货地址
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 安全保障 */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-green-700 text-sm">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="font-medium">安全支付保障</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• 支持多种支付方式，交易安全有保障</p>
                      <p>• 7天无理由退换货</p>
                      <p>• 正品保证，假一赔十</p>
                      <p>• 24小时客服在线服务</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 客服联系 */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">需要帮助？</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        客服热线：400-888-8888
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        邮箱：service@fragrance.com
                      </div>
                      <p className="text-xs text-gray-500">工作时间：9:00-21:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 