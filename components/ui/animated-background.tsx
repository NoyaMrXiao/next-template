import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedBackgroundProps {
  variant?: 'default' | 'minimal' | 'intense'
  className?: string
  children?: React.ReactNode
}

export function AnimatedBackground({ 
  variant = 'default', 
  className,
  children 
}: AnimatedBackgroundProps) {
  const variants = {
    default: {
      background: 'bg-gradient-to-br from-indigo-50 via-purple-50/50 to-amber-50/30',
      orbs: [
        {
          size: 'w-96 h-96',
          position: 'top-20 left-20',
          color: 'bg-purple-400/20',
          animation: 'animate-pulse'
        },
        {
          size: 'w-80 h-80',
          position: 'bottom-40 right-20',
          color: 'bg-amber-400/15',
          animation: 'animate-pulse delay-1000'
        },
        {
          size: 'w-64 h-64',
          position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          color: 'bg-indigo-400/10',
          animation: 'animate-pulse delay-500'
        }
      ]
    },
    minimal: {
      background: 'bg-gradient-to-br from-gray-50 via-white to-purple-50/20',
      orbs: [
        {
          size: 'w-64 h-64',
          position: 'top-10 right-10',
          color: 'bg-purple-300/10',
          animation: 'animate-pulse delay-300'
        },
        {
          size: 'w-48 h-48',
          position: 'bottom-20 left-20',
          color: 'bg-indigo-300/8',
          animation: 'animate-pulse delay-700'
        }
      ]
    },
    intense: {
      background: 'bg-gradient-to-br from-purple-100 via-indigo-100/80 to-amber-100/60',
      orbs: [
        {
          size: 'w-[500px] h-[500px]',
          position: 'top-0 left-0',
          color: 'bg-purple-400/25',
          animation: 'animate-pulse'
        },
        {
          size: 'w-[400px] h-[400px]',
          position: 'bottom-0 right-0',
          color: 'bg-amber-400/20',
          animation: 'animate-pulse delay-1000'
        },
        {
          size: 'w-[300px] h-[300px]',
          position: 'top-1/3 right-1/4',
          color: 'bg-indigo-400/15',
          animation: 'animate-pulse delay-500'
        },
        {
          size: 'w-[200px] h-[200px]',
          position: 'bottom-1/3 left-1/4',
          color: 'bg-pink-400/12',
          animation: 'animate-pulse delay-1500'
        }
      ]
    }
  }

  const config = variants[variant]

  return (
    <div className={cn("fixed inset-0", className)}>
      {/* 主背景渐变 */}
      <div className={cn("absolute inset-0", config.background)}>
        {/* 浮动光晕效果 */}
        {config.orbs.map((orb, index) => (
          <div
            key={index}
            className={cn(
              "absolute rounded-full blur-3xl",
              orb.size,
              orb.position,
              orb.color,
              orb.animation
            )}
          />
        ))}
        
        {/* 额外的动态效果 */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
      </div>
      
      {/* 内容区域 */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
} 