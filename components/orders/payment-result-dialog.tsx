"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, ExternalLink, X, CheckCircle } from "lucide-react"
import Image from "next/image"

interface PaymentResultDialogProps {
  isOpen: boolean
  onClose: () => void
  paymentType: 'wechat' | 'alipay' | 'bank' | 'stripe' | null
  qrCode?: string
  paymentUrl?: string
  message?: string
}

export function PaymentResultDialog({ 
  isOpen, 
  onClose, 
  paymentType, 
  qrCode, 
  paymentUrl, 
  message 
}: PaymentResultDialogProps) {
  const getTitle = () => {
    switch (paymentType) {
      case 'wechat':
        return '微信支付'
      case 'alipay':
        return '支付宝支付'
      case 'bank':
        return '银行卡支付'
      case 'stripe':
        return 'Stripe支付'
      default:
        return '支付'
    }
  }

  const getIcon = () => {
    switch (paymentType) {
      case 'wechat':
        return '💚'
      case 'alipay':
        return '🔵'
      case 'bank':
        return '💳'
      case 'stripe':
        return '🔷'
      default:
        return '💰'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
        {/* 自定义关闭按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <DialogHeader className="text-center pb-2">
          <div className="relative mb-4">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-2xl -z-10" />
            
            <div className="relative p-6">
              {/* 支付图标 */}
              <div className="text-4xl mb-4">{getIcon()}</div>
              
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {getTitle()}
              </DialogTitle>
              
              {message && (
                <p className="text-gray-600 mt-2">{message}</p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 二维码显示 */}
          {qrCode && (
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 bg-white rounded-lg shadow-sm border">
                <Image
                  src={qrCode}
                  alt="支付二维码"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <p className="text-sm text-gray-600">
                请使用{paymentType === 'wechat' ? '微信' : '相应应用'}扫描二维码完成支付
              </p>
            </div>
          )}

          {/* 支付链接 */}
          {paymentUrl && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <ExternalLink className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  点击下方按钮跳转到支付页面
                </p>
                <Button
                  onClick={() => window.open(paymentUrl, '_blank')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  前往支付
                </Button>
              </div>
            </div>
          )}

          {/* 支付说明 */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>🔒 支付过程安全加密</p>
            <p>⏰ 请在15分钟内完成支付</p>
            <p>❓ 如有问题请联系客服</p>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              关闭
            </Button>
            <Button
              onClick={() => {
                // 这里可以添加检查支付状态的逻辑
                onClose()
              }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              已完成支付
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 