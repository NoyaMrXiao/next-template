import { getUserOrders } from "@/actions/order"
import { OrdersList } from "@/components/orders/orders-list"
import { OrdersHeader } from "@/components/orders/orders-header"
import { OrdersEmpty } from "@/components/orders/orders-empty"

export default async function OrdersPage() {
  // 服务器端获取订单数据
  // TODO: 从认证系统获取真实用户ID
  const userId = 1
  const result = await getUserOrders(userId)
  
  const orders = result.success ? result.data || [] : []

  return (
    <div className="min-h-screen relative">
      {/* 背景装饰 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-rose-50/30 to-purple-50/30 -z-20" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl -z-10" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-200/10 to-orange-200/10 rounded-full blur-3xl -z-10" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersHeader ordersCount={orders.length} />
        
        {orders.length > 0 ? (
          <OrdersList orders={orders} userId={userId} />
        ) : (
          <OrdersEmpty />
        )}
      </div>
    </div>
  )
} 