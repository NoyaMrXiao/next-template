"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PaymentForm } from "@/components/payment/payment-form"
import { createOrderPayment } from "@/actions/stripe"
import { useRouter } from "next/navigation"
import { CreditCard, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import type { DbOrder } from "./orders-list"

interface PaymentDialogProps {
  order: DbOrder | null
  onClose: () => void
}

export function PaymentDialog({ order, onClose }: PaymentDialogProps) {
  const [paymentData, setPaymentData] = useState<{
    clientSecret: string
    paymentIntentId: string
  } | null>(null)
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const router = useRouter()

  // 创建支付意图
  const handleCreatePayment = async () => {
    if (!order) return

    setIsCreatingPayment(true)
    
    try {
      const result = await createOrderPayment({
        orderId: order.id.toString(),
        amount: Number(order.totalAmount),
        description: `订单 ${order.orderNo} 支付`
      })

      if (result.success && result.clientSecret) {
        setPaymentData({
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId!
        })
      } else {
        toast.error(result.error || '创建支付失败')
      }
    } catch (error) {
      toast.error('创建支付失败')
      console.error('支付创建失败:', error)
    } finally {
      setIsCreatingPayment(false)
    }
  }

  // 支付成功处理
  const handlePaymentSuccess = () => {
    setPaymentData(null)
    onClose()
    toast.success('支付成功！订单状态已更新')
    router.refresh() // 刷新页面数据
  }

  // 支付失败处理
  const handlePaymentError = (error: string) => {
    toast.error(`支付失败: ${error}`)
  }

  // 关闭弹窗
  const handleClose = () => {
    setPaymentData(null)
    onClose()
  }

  // 当订单变化时，自动创建支付意图
  useEffect(() => {
    if (order && !paymentData && !isCreatingPayment) {
      handleCreatePayment()
    }
  }, [order, paymentData, isCreatingPayment])

  return (
    <Dialog open={!!order} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
        {/* 自定义关闭按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <DialogHeader className="text-center pb-2">
          <div className="relative mb-4">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 to-pink-100/50 rounded-2xl -z-10" />
            <div className="absolute top-2 right-2 w-16 h-16 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-xl -z-10" />
            <div className="absolute bottom-2 left-2 w-12 h-12 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-full blur-xl -z-10" />
            
            <div className="relative p-6">
              {/* 支付图标 */}
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                订单支付
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {order && (
          <div className="space-y-6">
            {/* 订单信息卡片 */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl -z-10" />
              <div className="relative p-6 border border-blue-100/50 rounded-2xl backdrop-blur-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600">订单号</span>
                    <span className="font-mono font-semibold text-gray-900">{order.orderNo}</span>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    ¥{Number(order.totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 支付表单区域 */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 to-white/80 rounded-2xl -z-10" />
              <div className="relative p-6 border border-gray-100/50 rounded-2xl backdrop-blur-sm">
                {isCreatingPayment ? (
                  <div className="text-center py-12">
                    <div className="relative mb-4">
                      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute inset-0 w-12 h-12 mx-auto border-4 border-rose-200 rounded-full animate-ping" />
                    </div>
                    <p className="text-gray-600 font-medium">正在创建支付...</p>
                    <p className="text-sm text-gray-500 mt-1">请稍候，正在为您准备安全的支付环境</p>
                  </div>
                ) : paymentData ? (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">选择支付方式</h3>
                      <p className="text-sm text-gray-600">支持多种安全支付方式</p>
                    </div>
                    <PaymentForm
                      clientSecret={paymentData.clientSecret}
                      orderId={order.id.toString()}
                      amount={Number(order.totalAmount)}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onCancel={handleClose}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">创建支付失败</p>
                    <p className="text-sm text-gray-500 mb-4">请检查网络连接后重试</p>
                    <Button
                      onClick={handleCreatePayment}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full px-6"
                    >
                      重新创建支付
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* 安全提示 */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>🔒 您的支付信息将通过SSL加密传输</p>
              <p>💳 支持Visa、MasterCard、银联等主流银行卡</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 