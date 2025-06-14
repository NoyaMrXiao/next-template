import { FeatureCard } from "@/components/ui/feature-card"
import { Truck, Shield, HeadphonesIcon } from "lucide-react"

const features = [
  {
    icon: <Truck className="w-6 h-6 text-gray-600" />,
    title: "免费配送",
    description: "订单满299元享受免费配送服务"
  },
  {
    icon: <Shield className="w-6 h-6 text-gray-600" />,
    title: "正品保证",
    description: "所有商品均为品牌正品，假一赔十"
  },
  {
    icon: <HeadphonesIcon className="w-6 h-6 text-gray-600" />,
    title: "专业服务",
    description: "7×24小时专业客服，随时为您解答"
  }
]

export function HomeFeatures() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">为什么选择我们</h2>
        <p className="text-gray-600 mt-1">
          我们致力于为每一位客户提供最优质的购物体验
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  )
} 