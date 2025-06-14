'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CategoryItem } from '@/lib/types'
import { ArrowRight } from 'lucide-react'
import { Button } from './button'

interface CategoryGridProps {
  categories: CategoryItem[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/all?category=${encodeURIComponent(category.name)}`}
          className="block"
        >
          <div className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer">
            {/* 背景图片 */}
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* 渐变遮罩 */}
            <div className={`absolute inset-0 ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
            
            {/* 内容 */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-white/80">
                  {category.description}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.map((sub, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:text-white hover:bg-white/20 w-full justify-between pointer-events-none"
                >
                  查看详情
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}