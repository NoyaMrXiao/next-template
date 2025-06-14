"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, Truck, Clock, CheckCircle, MapPin, Phone, ArrowLeft, Eye, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// 订单状态类型
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

// 配送跟踪信息类型
interface TrackingInfo {
  time: string
  status: string
  location: string
  description: string
  isCompleted: boolean
}

// 订单类型
interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  createTime: string
  totalAmount: number
  items: Array<{
    id: string
    name: string
    brand: string
    price: number
    quantity: number
    imageUrl: string
  }>
  shippingAddress: {
    name: string
    phone: string
    address: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  tracking?: TrackingInfo[]
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  // 模拟订单数据
  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "2024010100001",
      status: "shipped",
      createTime: "2024-01-01 14:30:00",
      totalAmount: 899.00,
      items: [
        {
          id: "1",
          name: "香奈儿五号经典香水",
          brand: "CHANEL",
          price: 899,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"
        }
      ],
      shippingAddress: {
        name: "张三",
        phone: "138****8888",
        address: "北京市朝阳区三里屯街道工体北路8号院"
      },
      trackingNumber: "SF1234567890",
      estimatedDelivery: "2024-01-03",
      tracking: [
        {
          time: "2024-01-01 15:00",
          status: "订单确认",
          location: "北京仓库",
          description: "您的订单已确认，正在准备发货",
          isCompleted: true
        },
        {
          time: "2024-01-01 18:30",
          status: "已发货",
          location: "北京分拣中心",
          description: "商品已从仓库发出，正在运输途中",
          isCompleted: true
        },
        {
          time: "2024-01-02 09:15",
          status: "运输中",
          location: "天津中转站",
          description: "快件正在运输途中",
          isCompleted: true
        },
        {
          time: "2024-01-02 16:45",
          status: "派送中",
          location: "北京朝阳区派送点",
          description: "快件已到达派送网点，正在安排派送",
          isCompleted: false
        },
        {
          time: "",
          status: "已送达",
          location: "收货地址",
          description: "快件已成功送达",
          isCompleted: false
        }
      ]
    },
    {
      id: "2",
      orderNumber: "2024010100002",
      status: "delivered",
      createTime: "2023-12-28 10:15:00",
      totalAmount: 1299.00,
      items: [
        {
          id: "2",
          name: "迪奥真我香水",
          brand: "DIOR",
          price: 699,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400"
        },
        {
          id: "3",
          name: "兰蔻奇迹香水",
          brand: "LANCOME",
          price: 600,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400"
        }
      ],
      shippingAddress: {
        name: "张三",
        phone: "138****8888",
        address: "北京市朝阳区三里屯街道工体北路8号院"
      },
      trackingNumber: "SF0987654321",
      estimatedDelivery: "2023-12-30"
    },
    {
      id: "3",
      orderNumber: "2024010100003",
      status: "pending",
      createTime: "2024-01-02 09:20:00",
      totalAmount: 459.00,
      items: [
        {
          id: "4",
          name: "祖马龙英国梨香水",
          brand: "JO MALONE",
          price: 459,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400"
        }
      ],
      shippingAddress: {
        name: "张三",
        phone: "138****8888",
        address: "北京市朝阳区三里屯街道工体北路8号院"
      }
    }
  ]

  // 获取状态显示信息
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { text: "待确认", color: "bg-yellow-100 text-yellow-800", icon: Clock }
      case "confirmed":
        return { text: "已确认", color: "bg-blue-100 text-blue-800", icon: CheckCircle }
      case "shipped":
        return { text: "已发货", color: "bg-purple-100 text-purple-800", icon: Truck }
      case "delivered":
        return { text: "已送达", color: "bg-green-100 text-green-800", icon: CheckCircle }
      case "cancelled":
        return { text: "已取消", color: "bg-red-100 text-red-800", icon: RotateCcw }
      default:
        return { text: "未知", color: "bg-gray-100 text-gray-800", icon: Clock }
    }
  }

  // 显示订单详情和配送跟踪
  const showOrderTracking = (order: Order) => {
    setSelectedOrder(selectedOrder === order.id ? null : order.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">我的订单</h1>
              <p className="text-gray-600 mt-1">查看您的订单状态和配送信息</p>
            </div>
          </div>
        </div>

        {/* 订单列表 */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const StatusIcon = statusInfo.icon
            const isExpanded = selectedOrder === order.id

            return (
              <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          订单号: {order.orderNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          下单时间: {order.createTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${statusInfo.color} border-0`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.text}
                      </Badge>
                      <span className="text-xl font-bold text-rose-500">
                        ¥{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* 商品列表 */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">¥{item.price}</p>
                          <p className="text-sm text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 收货地址 */}
                  <div className="flex items-start space-x-3 mb-4 p-3 bg-blue-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{order.shippingAddress.name}</span>
                        <span className="text-gray-600">{order.shippingAddress.phone}</span>
                      </div>
                      <p className="text-gray-600">{order.shippingAddress.address}</p>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      {order.trackingNumber && (
                        <div className="text-sm text-gray-600">
                          <span>快递单号: </span>
                          <span className="font-mono font-medium">{order.trackingNumber}</span>
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div className="text-sm text-gray-600">
                          <span>预计送达: </span>
                          <span className="font-medium">{order.estimatedDelivery}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {order.status === "shipped" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showOrderTracking(order)}
                          className="border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {isExpanded ? "收起跟踪" : "查看配送"}
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Package className="w-4 h-4 mr-1" />
                        订单详情
                      </Button>
                    </div>
                  </div>

                  {/* 配送跟踪信息 */}
                  {isExpanded && order.tracking && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Truck className="w-5 h-5 mr-2 text-rose-500" />
                        配送跟踪
                      </h4>
                      <div className="space-y-4">
                        {order.tracking.map((track, index) => (
                          <div key={index} className="flex items-start space-x-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${
                                track.isCompleted ? 'bg-rose-500' : 'bg-gray-300'
                              }`} />
                              {index < order.tracking!.length - 1 && (
                                <div className={`w-0.5 h-8 mt-2 ${
                                  track.isCompleted ? 'bg-rose-500' : 'bg-gray-300'
                                }`} />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`font-medium ${
                                  track.isCompleted ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {track.status}
                                </span>
                                {track.time && (
                                  <span className="text-sm text-gray-500">{track.time}</span>
                                )}
                              </div>
                              <p className={`text-sm ${
                                track.isCompleted ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {track.location}
                              </p>
                              <p className={`text-sm mt-1 ${
                                track.isCompleted ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {track.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* 联系快递 */}
                      <div className="mt-6 pt-4 border-t border-rose-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>如有疑问，请联系快递客服</span>
                          </div>
                          <Button variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50">
                            联系客服
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 空状态 */}
        {orders.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无订单</h3>
            <p className="text-gray-600 mb-6">您还没有任何订单，快去选购心仪的商品吧！</p>
            <Link href="/categories/all">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                开始购物
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 