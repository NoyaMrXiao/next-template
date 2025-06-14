'use client'

import { Card, CardContent } from './card'
import { FeatureCardProps } from '@/lib/types'

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}