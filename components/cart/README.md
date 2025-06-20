# 购物车组件集合

这个目录包含了购物车页面的所有组件，按功能进行了模块化拆分。

## 组件列表

### 1. `EmptyCart`
空购物车状态组件，当购物车中没有商品时显示。

### 2. `CartHeader`
购物车页面头部组件，包含标题、继续购物按钮和清空购物车按钮。

```tsx
<CartHeader onClearCart={clearCart} />
```

### 3. `CartItem`
单个购物车商品项组件，展示商品信息、价格、数量控制和删除按钮。

```tsx
<CartItem
  item={item}
  onUpdateQuantity={updateQuantity}
  onRemoveItem={removeItem}
/>
```

### 4. `CartItemsList`
购物车商品列表组件，包含表格头部和商品列表。

```tsx
<CartItemsList
  items={state.items}
  onUpdateQuantity={updateQuantity}
  onRemoveItem={removeItem}
/>
```

### 5. `PaymentMethods`
支付方式选择组件。

```tsx
<PaymentMethods
  selectedPayment={selectedPayment}
  onPaymentChange={setSelectedPayment}
/>
```

### 6. `CheckoutSummary`
结算摘要组件，包含地址选择、支付方式、费用明细和结算按钮。

```tsx
<CheckoutSummary
  subtotal={state.totalPrice}
  deliveryFee={deliveryPrice}
  total={totalPrice}
  selectedPayment={selectedPayment}
  onPaymentChange={setSelectedPayment}
/>
```

## 使用示例

```tsx
import {
  EmptyCart,
  CartHeader,
  CartItemsList,
  CheckoutSummary
} from "@/components/cart"

export default function CartPage() {
  // ... 组件逻辑

  if (state.items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader onClearCart={clearCart} />

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
          <CartItemsList
            items={state.items}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />

          <CheckoutSummary
            subtotal={state.totalPrice}
            deliveryFee={deliveryPrice}
            total={totalPrice}
            selectedPayment={selectedPayment}
            onPaymentChange={setSelectedPayment}
          />
        </div>
      </div>
    </div>
  )
}
```

## 组件特点

- **模块化**: 每个组件职责单一，便于维护和测试
- **可复用**: 组件设计考虑了复用性，可以在其他页面中使用
- **类型安全**: 使用 TypeScript 提供完整的类型支持
- **响应式**: 所有组件都支持响应式设计
- **易于扩展**: 组件接口清晰，便于后续功能扩展 