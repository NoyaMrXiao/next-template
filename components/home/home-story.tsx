import { Card, CardContent } from "@/components/ui/card"

export function HomeStory() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Card className="bg-gray-50 border-0">
        <CardContent className="p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">品牌故事</h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
              我们深信，每一种香氛都承载着独特的情感与记忆。从法式的优雅到东方的神秘，
              从清新的花香到温暖的木质调，我们精心甄选每一款香氛产品，
              只为在您的生活中留下美好的嗅觉印记。让香氛成为您表达个性、营造氛围的完美伴侣。
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
} 