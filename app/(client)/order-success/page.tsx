"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  CheckCircle, 
  Package, 
  CreditCard, 
  Truck, 
  ArrowRight,
  Phone,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { handleCheckoutSuccess } from "@/actions/stripe"
import toast from "react-hot-toast"

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isProcessingStripe, setIsProcessingStripe] = useState(false)

  const orderNumber = searchParams.get('orderNumber')
  const orderId = searchParams.get('orderId')
  const payment = searchParams.get('payment')
  const sessionId = searchParams.get('session_id') // Stripe Checkout会话ID

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 处理Stripe支付成功回调
  useEffect(() => {
    if (isClient && payment === 'stripe' && sessionId && !isProcessingStripe) {
      setIsProcessingStripe(true)
      
      handleCheckoutSuccess(sessionId)
        .then((result) => {
          if (result.success) {
            toast.success('Stripe支付成功！订单状态已更新')
          } else {
            toast.error(result.error || 'Stripe支付处理失败')
          }
        })
        .catch((error) => {
          console.error('Stripe支付回调处理失败:', error)
          toast.error('支付回调处理失败')
        })
        .finally(() => {
          setIsProcessingStripe(false)
        })
    }
  }, [isClient, payment, sessionId, isProcessingStripe])

  // 如果没有订单号，重定向到首页
  useEffect(() => {
    if (isClient && !orderNumber) {
      router.push('/')
    }
  }, [isClient, orderNumber, router])

  if (!isClient || !orderNumber) {
    return null
  }

  // 根据支付方式显示不同的状态
  const getOrderStatus = () => {
    if (payment === 'stripe' && sessionId) {
      return {
        text: isProcessingStripe ? '处理中...' : '已支付',
        color: isProcessingStripe ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200',
        icon: isProcessingStripe ? Clock : CheckCircle
      }
    }
    return {
      text: '待支付',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock
    }
  }

  const statusInfo = getOrderStatus()
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 成功提示 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {payment === 'stripe' && sessionId ? '支付成功！' : '订单提交成功！'}
          </h1>
          <p className="text-lg text-gray-600">
            {payment === 'stripe' && sessionId 
              ? '感谢您的购买，我们会尽快为您安排发货' 
              : '感谢您的购买，请及时完成支付'}
          </p>
        </div>

        {/* 订单信息卡片 */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <Package className="w-6 h-6 mr-3" />
              订单详情
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 左侧：订单基本信息 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">订单号</h3>
                  <p className="text-2xl font-mono font-bold text-gray-900">
                    {orderNumber}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">订单状态</h3>
                  <Badge className={statusInfo.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.text}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">下单时间</h3>
                  <p className="text-gray-900 font-medium">
                    {new Date().toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* 右侧：后续步骤 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">后续步骤</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">订单已提交</p>
                      <p className="text-sm text-gray-600">系统已收到您的订单</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">等待支付</p>
                      <p className="text-sm text-gray-600">请及时完成支付</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                      <Truck className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">准备发货</p>
                      <p className="text-sm text-gray-400">支付完成后安排发货</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 重要提醒 */}
        <Card className="border-l-4 border-l-amber-400 bg-amber-50 border-amber-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">重要提醒</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• 请在30分钟内完成支付，超时订单将自动取消</li>
                  <li>• 支付完成后，我们会在2小时内安排发货</li>
                  <li>• 如有问题，请及时联系客服</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/orders`}>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3">
              <Package className="w-4 h-4 mr-2" />
              查看订单详情
            </Button>
          </Link>
          
          <Link href="/categories/all">
            <Button variant="outline" className="px-8 py-3">
              继续购物
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* 客服信息 */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <div className="inline-flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm">
              如有疑问，请联系客服：
              <span className="font-medium text-gray-900 ml-1">400-888-8888</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-pulse">
            <Package className="w-12 h-12 text-green-500" />
          </div>
          <p className="text-lg text-gray-600">正在加载订单信息...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}