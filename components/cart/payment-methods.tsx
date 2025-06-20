interface PaymentMethodsProps {
  selectedPayment: string
  onPaymentChange: (payment: string) => void
}

export function PaymentMethods({ selectedPayment, onPaymentChange }: PaymentMethodsProps) {
  return (
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
            onChange={(e) => onPaymentChange(e.target.value)}
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
            onChange={(e) => onPaymentChange(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">支付宝</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="payment"
            value="stripe"
            checked={selectedPayment === "stripe"}
            onChange={(e) => onPaymentChange(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">银行卡支付 (Stripe)</span>
        </label>
      </div>
    </div>
  )
} 