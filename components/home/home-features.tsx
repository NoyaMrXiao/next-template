import { FeatureCard } from "@/components/ui/feature-card"
import { Truck, Shield, HeadphonesIcon, Gift, Star, Clock } from "lucide-react"

const features = [
  {
    icon: <Truck className="w-8 h-8 text-gray-700" />,
    title: "免费配送",
    description: "全国范围内快速配送，让香氛更快到达您身边"
  },
  {
    icon: <Shield className="w-8 h-8 text-gray-700" />,
    title: "正品保证", 
    description: "直采正品，每一瓶香氛都承载着品牌的匠心精神"
  },
  {
    icon: <Gift className="w-8 h-8 text-gray-700" />,
    title: "精美包装",
    description: "每份订单都配有精美包装，传递您的心意"
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8 text-gray-700" />,
    title: "专业服务",
    description: "香氛顾问在线咨询，为您推荐最适合的香氛"
  },
  {
    icon: <Star className="w-8 h-8 text-gray-700" />,
    title: "会员特权",
    description: "注册会员享受积分奖励和专享优惠活动"
  },
  {
    icon: <Clock className="w-8 h-8 text-gray-700" />,
    title: "7天退换",
    description: "不满意可在7天内无理由退换，购物无忧"
  }
]

export function HomeFeatures() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
          为什么选择
          <span className="font-normal text-gray-700">我们</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          我们致力于为每一位客户提供最优质的购物体验和服务保障
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6 group-hover:bg-gray-100 transition-colors duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      
      {/* 底部装饰 */}
      <div className="text-center mt-16 pt-8 border-t border-gray-100">
        <p className="text-gray-500 text-sm">
          已有 <span className="font-medium text-gray-700">10,000+</span> 位客户选择了我们的服务
        </p>
      </div>
    </section>
  )
} 