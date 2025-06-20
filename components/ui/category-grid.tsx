'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Category } from '@/lib/types'

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/all?category=${encodeURIComponent(category.name)}`}
          className="group block"
        >
          <div className="space-y-4">
            {/* 图片区域 - 极简设计 */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105"
              />
              
              {/* 极简遮罩 - 仅在悬浮时显示 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>
            
            {/* 文字内容 - 极简排版 */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-light text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                {category.name}
              </h3>
              
              {/* 可选：显示商品数量或简短描述 */}
              {category.description && (
                <p className="text-sm text-gray-500 font-light">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}