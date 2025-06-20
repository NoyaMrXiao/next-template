import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AddressSelector } from "@/components/address-selector"
import { PaymentMethods } from "./payment-methods"

interface CheckoutSummaryProps {
  subtotal: number
  deliveryFee: number
  total: number
  selectedPayment: string
  onPaymentChange: (payment: string) => void
}

export function CheckoutSummary({
  subtotal,
  deliveryFee,
  total,
}: CheckoutSummaryProps) {
  return (
    <div className="xl:col-span-2">
      <div className="bg-primary p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Checkout</h2>
        
        {/* 地址选择 */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            配送地址
          </label>
          <AddressSelector />
        </div>


        {/* 费用明细 */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">商品小计</span>
            <span className="text-gray-900">¥{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">配送费</span>
            <span className="text-green-600">
              {deliveryFee === 0 ? "免费" : `¥${deliveryFee.toFixed(2)}`}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-900">TOTAL</span>
              <span className="text-2xl font-bold text-gray-900">
                ¥{total.toFixed(2)}
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
  )
} 