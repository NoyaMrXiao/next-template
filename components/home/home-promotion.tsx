import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"

export function HomePromotion() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-lg font-semibold text-white">限时特惠</h3>
                <p className="text-white/80 text-sm">精选香氛 低至5折</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="bg-white text-gray-900 hover:bg-white/90">
              立即抢购 <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
} 