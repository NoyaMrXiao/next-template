import { Button } from "@/components/ui/button"
import { ArrowRight, Gift, Star } from "lucide-react"
import Link from "next/link"

export function HomePromotion() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 主要促销横幅 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-black">
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-repeat" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          
          <div className="relative px-8 py-12 lg:px-16 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* 文字内容 */}
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Gift className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">限时特惠</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-light text-white leading-tight">
                  新会员专享
                  <br />
                  <span className="font-normal">香氛礼遇</span>
                </h2>
                
                <p className="text-white/80 text-lg leading-relaxed">
                  注册会员即可享受精选香氛系列特别优惠，
                  <br />
                  开启您的专属香氛之旅
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/auth">
                    <Button className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-full font-medium">
                      立即注册 <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium">
                      浏览商品
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* 装饰元素 */}
              <div className="relative hidden lg:block">
                <div className="aspect-square max-w-sm mx-auto">
                  <div className="relative w-full h-full">
                    {/* 装饰圆环 */}
                    <div className="absolute inset-0 border border-white/20 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-4 border border-white/10 rounded-full animate-spin-reverse-slow"></div>
                    <div className="absolute inset-8 border border-white/5 rounded-full animate-spin-slow"></div>
                    
                    {/* 中心内容 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Star className="w-8 h-8 text-white mx-auto" />
                        <div className="text-white font-light">
                          <div className="text-2xl">5选2</div>
                          <div className="text-sm opacity-80">明星混搭礼</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 次要促销信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-6 bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">免费礼品包装</h3>
            <p className="text-gray-600 text-sm">每份订单均提供精美包装</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">会员积分</h3>
            <p className="text-gray-600 text-sm">购物即可获得积分奖励</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">快速配送</h3>
            <p className="text-gray-600 text-sm">全国范围内快速送达</p>
          </div>
        </div>
      </div>
    </section>
  )
} 