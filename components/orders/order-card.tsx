"use client"

import Image from "next/image"
import { Package, Truck, Clock, CheckCircle, MapPin, Eye, RotateCcw, CreditCard, Calendar, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cancelOrder } from "@/actions/order"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { DbOrder } from "./orders-list"
import { OrderStatus } from "@prisma/client"
import { PaymentMethod } from "@prisma/client"

interface OrderCardProps {
  order: DbOrder
  userId: number
  isExpanded: boolean
  onShowDetails: (orderId: number) => void
  onPayment: (order: DbOrder) => void
  isProcessingPayment?: boolean
}

export function OrderCard({ order, userId, isExpanded, onShowDetails, onPayment, isProcessingPayment = false }: OrderCardProps) {
  const router = useRouter()

  // 获取支付方式显示名称
  const getPaymentMethodName = (method: PaymentMethod | null) => {
    if (!method) return '未选择'
    
    switch (method) {
      case PaymentMethod.WECHAT_PAY:
        return '微信支付'
      case PaymentMethod.ALIPAY:
        return '支付宝'
      case PaymentMethod.BANK_CARD:
        return '银行卡'
      case PaymentMethod.BALANCE:
        return '余额支付'
      default:
        // 处理STRIPE或其他支付方式
        if (String(method) === 'STRIPE') {
          return 'Stripe支付'
        }
        return '未知支付方式'
    }
  }

  // 映射数据库状态到显示状态
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return {
          text: "待支付",
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Clock
        }
      case "PAID":
        return {
          text: "已支付",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: CheckCircle
        }
      case "SHIPPED":
        return {
          text: "已发货",
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: Truck
        }
      case "DELIVERED":
        return {
          text: "已送达",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle
        }
      case "COMPLETED":
        return {
          text: "已完成",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle
        }
      case "CANCELLED":
        return {
          text: "已取消",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: RotateCcw
        }
      case "REFUNDED":
        return {
          text: "已退款",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: RotateCcw
        }
      default:
        return {
          text: "未知",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Clock
        }
    }
  }

  // 获取完整地址
  const getFullAddress = (address: DbOrder['address']) => {
    return `${address.province}${address.city}${address.district}${address.detail}`
  }

  // 获取商品主图
  const getProductImage = (images: string[]) => {
    return images.length > 0 ? images[0] : '/placeholder-product.jpg'
  }

  // 取消订单
  const handleCancelOrder = async () => {
    try {
      const result = await cancelOrder(order.id, userId)

      if (result.success) {
        toast.success('订单已取消')
        router.refresh() // 刷新页面数据
      } else {
        toast.error(result.error || '取消订单失败')
      }
    } catch (error) {
      toast.error('取消订单失败')
      console.error('取消订单失败:', error)
    }
  }

  const statusInfo = getStatusInfo(order.status)
  const StatusIcon = statusInfo.icon

  return (
    <Card className="border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* 订单头部 */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Hash className="w-4 h-4" />
              <span className="font-mono font-medium text-gray-900">{order.orderNo}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date(order.createdAt).toLocaleString('zh-CN')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={`${statusInfo.color} border font-medium`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.text}
            </Badge>
            <div className="text-right">
              <div className="text-xl font-bold text-rose-500">
                ¥{Number(order.totalAmount).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* 商品列表 */}
        <div className="space-y-3 mb-6">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={getProductImage(item.product.images)}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{item.product.name}</h4>
                <p className="text-sm text-gray-500">{item.product.brand || '未知品牌'}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">¥{Number(item.price).toFixed(2)}</p>
                <p className="text-sm text-gray-500">x{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 收货地址 */}
        <div className="flex items-start space-x-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900">{order.address.name}</span>
              <span className="text-gray-600">{order.address.phone}</span>
            </div>
            <p className="text-gray-600 text-sm">{getFullAddress(order.address)}</p>
          </div>
        </div>

        {/* 订单详情展开区域 */}
        {isExpanded && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-4 h-4 mr-2 text-gray-600" />
              订单详情
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">商品小计</span>
                <span className="font-medium text-gray-900">¥{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">配送费</span>
                <span className="font-medium text-gray-900">¥{Number(order.shippingFee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">优惠金额</span>
                <span className="font-medium text-green-600">-¥{Number(order.discountAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">配送方式</span>
                <span className="font-medium text-gray-900">{order.shippingMethod || '标准配送'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">支付方式</span>
                <span className="font-medium text-gray-900">{getPaymentMethodName(order.paymentMethod)}</span>
              </div>
              {order.trackingNumber && (
                <div className="col-span-full flex justify-between items-center">
                  <span className="text-gray-600">快递单号</span>
                  <span className="font-mono font-medium text-gray-900">{order.trackingNumber}</span>
                </div>
              )}
              {order.remark && (
                <div className="col-span-full">
                  <span className="text-gray-600 block mb-1">订单备注</span>
                  <span className="font-medium text-gray-900">{order.remark}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* 操作按钮区域 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {order.trackingNumber && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Package className="w-4 h-4" />
                <span className="font-mono">{order.trackingNumber}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* 支付和取消按钮 - 仅对待支付订单显示 */}
            {order.status === "PENDING" && (
              <>
                <Button
                  onClick={() => onPayment(order)}
                  disabled={isProcessingPayment}
                  className="bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isProcessingPayment ? '处理中...' : '立即支付'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={isProcessingPayment}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  取消
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowDetails(order.id)}
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              {isExpanded ? "收起" : "详情"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 