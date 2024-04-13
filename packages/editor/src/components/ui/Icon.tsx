import { cn } from '@repo/ui/lib/utils'
import { LucideIcon } from 'lucide-react'
import { memo } from 'react'

export type IconProps = {
  Icon?: LucideIcon
  className?: string
  strokeWidth?: number
}

export const Icon = memo(({ Icon, className, strokeWidth }: IconProps) => {
  if (!Icon) {
    return null
  }

  return <Icon className={cn('w-4 h-4', className)} strokeWidth={strokeWidth || 2.5} />
})

Icon.displayName = 'Icon'
