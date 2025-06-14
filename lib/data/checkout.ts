// 支付方式数据
export const paymentMethods = [
  { 
    id: 1, 
    name: "微信支付", 
    icon: "💚", 
    desc: "推荐使用，支持花呗分期",
    fee: 0,
    discount: 0
  },
  { 
    id: 2, 
    name: "支付宝", 
    icon: "🔵", 
    desc: "安全便捷，支持余额宝支付",
    fee: 0,
    discount: 0.02 // 2%折扣
  },
  { 
    id: 3, 
    name: "银行卡", 
    icon: "💳", 
    desc: "储蓄卡/信用卡，部分银行有优惠",
    fee: 0,
    discount: 0
  },
  { 
    id: 4, 
    name: "Stripe支付", 
    icon: "🔷", 
    desc: "国际银行卡支付，安全便捷",
    fee: 0,
    discount: 0
  }
]

// 配送方式数据
export const deliveryMethods = [
  { 
    id: 1, 
    name: "标准配送", 
    time: "3-5个工作日", 
    price: 0, 
    desc: "免费配送，工作日配送",
    icon: "📦"
  },
  { 
    id: 2, 
    name: "次日达", 
    time: "次日送达", 
    price: 15, 
    desc: "加急配送，限工作日下单",
    icon: "🚚"
  },
  { 
    id: 3, 
    name: "当日达", 
    time: "当日送达", 
    price: 25, 
    desc: "限部分地区，12点前下单",
    icon: "⚡"
  }
]

// 优惠券数据
export const availableCoupons = [
  {
    id: "WELCOME10",
    name: "新用户专享",
    desc: "满199减20",
    discount: 20,
    minAmount: 199,
    type: "amount"
  },
  {
    id: "SAVE5",
    name: "限时优惠",
    desc: "全场95折",
    discount: 0.05,
    minAmount: 100,
    type: "percent"
  },
  {
    id: "FREE_SHIP",
    name: "包邮券",
    desc: "免配送费",
    discount: 0,
    minAmount: 0,
    type: "shipping"
  }
]

// 安全保障信息
export const securityFeatures = [
  "支持多种支付方式，交易安全有保障",
  "7天无理由退换货",
  "正品保证，假一赔十",
  "24小时客服在线服务"
]

// 客服信息
export const customerService = {
  phone: "400-888-8888",
  email: "service@fragrance.com",
  workingHours: "9:00-21:00"
}

// 类型定义
export interface PaymentMethod {
  id: number
  name: string
  icon: string
  desc: string
  fee: number
  discount: number
}

export interface DeliveryMethod {
  id: number
  name: string
  time: string
  price: number
  desc: string
  icon: string
}

export interface Coupon {
  id: string
  name: string
  desc: string
  discount: number
  minAmount: number
  type: "amount" | "percent" | "shipping"
} 