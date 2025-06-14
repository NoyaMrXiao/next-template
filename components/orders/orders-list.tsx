"use client"

import { useState } from "react"
import { OrderCard } from "@/components/orders/order-card"
import { PaymentResultDialog } from "./payment-result-dialog"
import { OrderStatus, PaymentMethod } from "@prisma/client"
import { processPayment } from "@/actions/payment"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

// 数据库订单类型
export type DbOrder = {
    id: number
    orderNo: string
    status: OrderStatus
    paymentMethod: PaymentMethod | null
    totalAmount: any // Prisma Decimal类型
    subtotal: any
    shippingFee: any
    discountAmount: any
    shippingMethod: string | null
    trackingNumber: string | null
    remark: string | null
    createdAt: Date
    updatedAt: Date
    address: {
        id: number
        name: string
        phone: string
        province: string
        city: string
        district: string
        detail: string
        userId?: number
        postcode?: string | null
        isDefault?: boolean
    }
    orderItems: Array<{
        id: number
        quantity: number
        price: any
        totalPrice: any
        product: {
            id: number
            name: string
            brand: string | null
            images: string[]
        }
    }>
    payments: Array<{
        id: number
        status: string
        method: string
        amount: any
    }>
}

interface OrdersListProps {
    orders: DbOrder[]
    userId: number
}
    
export function OrdersList({ orders, userId }: OrdersListProps) {
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null)
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)
    
    // 支付结果弹窗状态
    const [paymentResult, setPaymentResult] = useState<{
        isOpen: boolean
        paymentType: 'wechat' | 'alipay' | 'bank' | 'stripe' | null
        qrCode?: string
        paymentUrl?: string
        message?: string
    }>({
        isOpen: false,
        paymentType: null
    })
    
    const router = useRouter()

    const handleShowDetails = (orderId: number) => {
        setSelectedOrder(selectedOrder === orderId ? null : orderId)
    }

    const handlePayment = async (order: DbOrder) => {
        if (!order.paymentMethod) {
            toast.error('订单支付方式异常')
            return
        }

        setIsProcessingPayment(true)

        try {
            const result = await processPayment(
                order.id,
                order.paymentMethod,
                Number(order.totalAmount),
                userId
            )

            if (result.success) {
                // 根据不同支付方式处理结果
                switch (order.paymentMethod) {
                    case PaymentMethod.WECHAT_PAY:
                        if (result.data?.qrCode) {
                            setPaymentResult({
                                isOpen: true,
                                paymentType: 'wechat',
                                qrCode: result.data.qrCode,
                                message: result.data.message
                            })
                        }
                        break

                    case PaymentMethod.ALIPAY:
                        if (result.data?.paymentUrl) {
                            setPaymentResult({
                                isOpen: true,
                                paymentType: 'alipay',
                                paymentUrl: result.data.paymentUrl,
                                message: result.data.message
                            })
                        }
                        break

                    case PaymentMethod.BANK_CARD:
                        if (result.data?.paymentUrl) {
                            setPaymentResult({
                                isOpen: true,
                                paymentType: 'bank',
                                paymentUrl: result.data.paymentUrl,
                                message: result.data.message
                            })
                        }
                        break

                    case PaymentMethod.BALANCE:
                        toast.success(result.data?.message || '余额支付成功')
                        router.refresh() // 刷新页面数据
                        break

                    default:
                        // 处理Stripe或其他支付方式
                        if (String(order.paymentMethod) === 'STRIPE') {
                            // 使用支付链接弹窗显示Stripe Checkout页面
                            if (result.data?.paymentUrl) {
                                setPaymentResult({
                                    isOpen: true,
                                    paymentType: 'stripe',
                                    paymentUrl: result.data.paymentUrl,
                                    message: result.data.message
                                })
                            }
                        } else {
                            toast.success(result.data?.message || '支付处理成功')
                        }
                        break
                }
            } else {
                toast.error(result.error || '支付处理失败')
            }
        } catch (error) {
            console.error('支付处理失败:', error)
            toast.error('支付处理失败，请重试')
        } finally {
            setIsProcessingPayment(false)
        }
    }

    const handleClosePaymentResult = () => {
        setPaymentResult({
            isOpen: false,
            paymentType: null
        })
    }

    return (
        <>
            <div className="space-y-6">
                {orders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        userId={userId}
                        isExpanded={selectedOrder === order.id}
                        onShowDetails={handleShowDetails}
                        onPayment={handlePayment}
                        isProcessingPayment={isProcessingPayment}
                    />
                ))}
            </div>

            {/* 支付结果弹窗 - 用于显示二维码和支付链接 */}
            <PaymentResultDialog
                isOpen={paymentResult.isOpen}
                onClose={handleClosePaymentResult}
                paymentType={paymentResult.paymentType}
                qrCode={paymentResult.qrCode}
                paymentUrl={paymentResult.paymentUrl}
                message={paymentResult.message}
            />
        </>
    )
} 