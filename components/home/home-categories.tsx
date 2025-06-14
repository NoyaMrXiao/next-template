import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryGrid } from "@/components/ui/category-grid"
import { ArrowRight } from "lucide-react"

interface HomeCategoriesProps {
  categories: any[]
}

export function HomeCategories({ categories }: HomeCategoriesProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">香氛分类</h2>
          <p className="text-gray-600 mt-1">
            探索我们精心策划的香氛系列
          </p>
        </div>
        <Link href="/categories/all">
          <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
            查看全部 <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
      <CategoryGrid categories={categories} />
    </section>
  )
} 