import React from 'react'
import { Button, buttonVariants } from './button'
import { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

interface GradientButtonProps extends 
  Omit<React.ComponentProps<"button">, 'variant'>,
  Omit<VariantProps<typeof buttonVariants>, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple-amber' | 'indigo-purple'
  glow?: boolean
  children: React.ReactNode
}

export function GradientButton({
  variant = 'primary',
  glow = false,
  className,
  children,
  ...props
}: GradientButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700',
    'purple-amber': 'bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600',
    'indigo-purple': 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
  }

  const glowEffects = {
    primary: 'shadow-purple-500/25 hover:shadow-purple-500/40',
    secondary: 'shadow-gray-500/25 hover:shadow-gray-500/40',
    success: 'shadow-green-500/25 hover:shadow-green-500/40',
    warning: 'shadow-amber-500/25 hover:shadow-amber-500/40',
    danger: 'shadow-red-500/25 hover:shadow-red-500/40',
    'purple-amber': 'shadow-purple-500/25 hover:shadow-purple-500/40',
    'indigo-purple': 'shadow-indigo-500/25 hover:shadow-indigo-500/40'
  }

  return (
    <Button
      className={cn(
        'text-white rounded-full transition-all duration-300 transform hover:scale-105 border-0',
        variants[variant],
        glow && 'shadow-lg hover:shadow-xl',
        glow && glowEffects[variant],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
} 