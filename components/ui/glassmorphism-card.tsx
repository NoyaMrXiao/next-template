import React from 'react'
import { cn } from '@/lib/utils'

interface GlassmorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'blur' | 'subtle'
  gradient?: string
  children: React.ReactNode
}

export function GlassmorphismCard({ 
  className, 
  variant = 'default', 
  gradient,
  children, 
  ...props 
}: GlassmorphismCardProps) {
  const variants = {
    default: 'bg-white/30 backdrop-blur-xl border border-white/40',
    blur: 'bg-white/20 backdrop-blur-xl border border-white/30',
    subtle: 'bg-white/10 backdrop-blur-sm border border-white/20'
  }

  return (
    <div
      className={cn(
        'rounded-3xl shadow-lg transition-all duration-300',
        variants[variant],
        gradient && `bg-gradient-to-br ${gradient}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 