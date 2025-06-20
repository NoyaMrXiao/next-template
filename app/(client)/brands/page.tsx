import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "品牌故事 | 我们的家",
  description: "探索我们的品牌故事，感受英伦优雅生活方式",
};

export default function BrandsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full">
        <Image
          src="/hero-bg.webp"
          alt="品牌展示"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="mb-4 text-5xl font-light">我们的家</h1>
            <p className="text-xl font-light">探索英伦优雅生活艺术</p>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-16 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-light">品牌故事</h2>
            <p className="text-gray-600">
              我们的家坐落在伦敦马里波恩，是一栋乔治亚风格的四层建筑。多年来，时尚、文学、艺术与音乐界的明星都曾在附近居住。在我们的家里，有着高高的天花板与舒适的家具，阳光洒满了大房间。
            </p>
            <p className="text-gray-600">
              在宽敞的中央楼梯间，您会遇到我们的创意总监、调香大师与产品设计师。我们经常欢迎客人到我们家参加活动，届时楼梯间会焕发魔法般的活力，展示我们的新香水与产品。
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/images/brand-story.jpg"
              alt="品牌故事"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-light">品牌价值</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-20 w-20">
                <Image
                  src="/images/value-1.jpg"
                  alt="英伦经典"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-light">英伦经典</h3>
              <p className="text-gray-600">传承英伦优雅，演绎经典风尚</p>
            </div>
            <div className="space-y-4 text-center">
              <div className="mx-auto h-20 w-20">
                <Image
                  src="/images/value-2.jpg"
                  alt="匠心工艺"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-light">匠心工艺</h3>
              <p className="text-gray-600">精湛工艺，成就完美香氛</p>
            </div>
            <div className="space-y-4 text-center">
              <div className="mx-auto h-20 w-20">
                <Image
                  src="/images/value-3.jpg"
                  alt="创新精神"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-light">创新精神</h3>
              <p className="text-gray-600">突破传统，创造独特体验</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-16 md:grid-cols-2">
          <div className="relative h-[400px]">
            <Image
              src="/images/experience.jpg"
              alt="品牌体验"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-light">沉浸式体验</h2>
            <p className="text-gray-600">
              这里不仅是香水工作室，更是设计工作室、陈列室与剧院的融合。我们为每位访客提供独特的香氛之旅，让您深入了解英伦香氛艺术。
            </p>
            <button className="mt-4 border border-black px-8 py-3 text-sm hover:bg-black hover:text-white">
              预约体验
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <h3 className="mb-2 text-lg font-light">全场免运费</h3>
              <p className="text-sm text-gray-600">
                所有订单将以最快捷安全的运送方式送到客户手中
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-light">礼品包装</h3>
              <p className="text-sm text-gray-600">
                精美礼盒包装，为您的每一份礼物增添优雅
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-light">专业建议</h3>
              <p className="text-sm text-gray-600">
                香氛专家为您提供个性化的专业建议
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
