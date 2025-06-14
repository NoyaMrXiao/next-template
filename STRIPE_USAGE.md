# 如何使用 Stripe 支付功能

## 快速开始

### 1. 配置环境变量

创建 `.env.local` 文件：

```env
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 测试支付流程

1. 访问订单页面：`http://localhost:3000/orders`
2. 找到状态为 "待支付" 的订单
3. 点击 "立即支付" 按钮
4. 在支付表单中输入测试卡号：`4242 4242 4242 4242`
5. 填写其他信息（可以是任意有效格式）：
   - 过期日期：12/34
   - CVC：123
6. 点击 "支付" 按钮
7. 观察支付结果

## 支付流程详解

### 用户界面

```tsx
// 订单列表页面显示支付按钮
{order.status === "pending" && (
  <Button onClick={() => handlePayment(order)}>
    <CreditCard className="w-4 h-4 mr-1" />
    立即支付
  </Button>
)}
```

### 创建支付意图

```tsx
// 用户点击支付时创建支付意图
const result = await createOrderPayment({
  orderId: order.id,
  amount: order.totalAmount,
  description: `订单 ${order.orderNumber} 支付`
})
```

### 支付表单

```tsx
// PaymentForm 组件处理实际支付
<PaymentForm
  clientSecret={paymentData.clientSecret}
  orderId={paymentOrder.id}
  amount={paymentOrder.totalAmount}
  onSuccess={handlePaymentSuccess}
  onError={handlePaymentError}
  onCancel={handlePaymentCancel}
/>
```

## 代码示例

### 创建支付 Action

```typescript
// lib/actions/payment.ts
export async function createOrderPayment(data: PaymentData): Promise<PaymentResult> {
  try {
    const paymentIntent = await createPaymentIntent(
      data.amount,
      'cny',
      {
        orderId: data.orderId,
        description: data.description || `订单 ${data.orderId} 支付`,
      }
    )

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '创建支付失败',
    }
  }
}
```

### 处理支付成功

```typescript
const handlePaymentSuccess = () => {
  setPaymentOrder(null)
  setPaymentData(null)
  toast.success('支付成功！订单状态已更新')
  // 刷新订单数据或重定向
}
```

### 处理支付失败

```typescript
const handlePaymentError = (error: string) => {
  toast.error(`支付失败: ${error}`)
}
```

## 测试场景

### 成功支付
- 卡号：`4242 4242 4242 4242`
- 结果：支付成功，显示成功通知

### 需要验证
- 卡号：`4000 0025 0000 3155`
- 结果：触发额外验证流程

### 支付被拒绝
- 卡号：`4000 0000 0000 0002`
- 结果：支付失败，显示错误信息

### 余额不足
- 卡号：`4000 0000 0000 9995`
- 结果：支付失败，提示余额不足

## 自定义和扩展

### 添加其他支付方式

```typescript
// 在 stripe.ts 中扩展支付方式
const paymentIntent = await stripe.paymentIntents.create({
  amount: formatAmountForStripe(amount, currency),
  currency: currency,
  payment_method_types: ['card', 'alipay', 'wechat_pay'], // 添加更多支付方式
  metadata,
})
```

### 自定义支付表单样式

```typescript
// 在 PaymentForm 组件中自定义样式
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
}
```

### 添加支付状态持久化

```typescript
// 在真实应用中，应该将支付状态保存到数据库
async function handlePaymentSuccess(paymentIntentId: string, orderId: string) {
  // 更新数据库订单状态
  await updateOrder(orderId, {
    status: 'confirmed',
    paymentIntentId,
    paidAt: new Date(),
  })
  
  // 发送确认邮件
  await sendOrderConfirmationEmail(orderId)
  
  // 更新库存
  await updateInventory(orderId)
}
```

## 调试技巧

### 查看支付日志

```typescript
// 在开发环境中，支付相关日志会输出到控制台
console.log('创建支付意图:', paymentIntent)
console.log('支付确认结果:', paymentResult)
```

### 使用 Stripe Dashboard

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 查看 "支付" 页面了解支付状态
3. 查看 "日志" 了解API调用详情
4. 查看 "Webhooks" 了解事件处理情况

### 网络调试

使用浏览器开发者工具查看：
- Network 标签页中的API请求
- Console 标签页中的错误信息
- Application 标签页中的本地存储状态

## 常见问题解答

**Q: 支付按钮无响应怎么办？**
A: 检查环境变量配置，确保 Stripe 密钥正确设置。

**Q: 支付表单无法加载？**
A: 确认网络连接正常，检查浏览器控制台是否有JavaScript错误。

**Q: 测试卡号不工作？**
A: 确保使用正确的测试环境密钥，不要使用生产环境密钥。

**Q: 如何处理支付失败？**
A: 系统会自动显示错误信息，用户可以重试或使用其他支付方式。

**Q: 支付成功但订单状态未更新？**
A: 检查支付成功处理逻辑，确保正确调用状态更新函数。 