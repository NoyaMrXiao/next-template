'use client'

import { useState, useEffect } from 'react'
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { handlePaymentSuccess, handlePaymentFailure } from '@/actions/stripe'

// ===========================================
// 类型定义
// ===========================================

interface PaymentFormProps {
  clientSecret: string
  orderId: string
  amount: number
  onSuccess?: () => void
  onError?: (error: string) => void
  onCancel?: () => void
}

// ===========================================
// Stripe 配置
// ===========================================

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '12px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
}

// ===========================================
// 支付表单组件
// ===========================================

function PaymentFormContent({ clientSecret, orderId, amount, onSuccess, onError, onCancel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('支付表单未正确加载')
      setIsProcessing(false)
      return
    }

    try {
      // 确认支付
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (stripeError) {
        setError(stripeError.message || '支付失败')
        toast.error(stripeError.message || '支付失败')
        
        // 记录支付失败
        await handlePaymentFailure(
          '',
          orderId,
          stripeError.message || '支付失败'
        )
        
        onError?.(stripeError.message || '支付失败')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 支付成功
        toast.success('支付成功！')
        
        // 处理支付成功
        await handlePaymentSuccess(paymentIntent.id, orderId)
        
        onSuccess?.()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '支付过程中发生错误'
      setError(errorMessage)
      toast.error(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>安全支付</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          支付金额: <span className="font-semibold text-rose-600">¥{amount.toFixed(2)}</span>
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 卡片信息输入 */}
          <div className="p-3 border rounded-lg bg-gray-50">
            <CardElement options={cardElementOptions} />
          </div>
          
          {/* 错误信息 */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* 安全提示 */}
          <div className="flex items-start space-x-2 text-xs text-gray-500">
            <Lock className="w-3 h-3 mt-0.5" />
            <p>您的支付信息通过 SSL 加密保护，我们不会存储您的卡片信息。</p>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  处理中...
                </>
              ) : (
                `支付 ¥${amount.toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// ===========================================
// 主支付组件
// ===========================================

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  )
} 