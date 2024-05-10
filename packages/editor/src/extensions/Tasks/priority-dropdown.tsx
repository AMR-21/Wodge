import { buttonVariants } from '@repo/ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import { cn } from '@repo/ui/lib/utils'
import { Task } from './task-card'
import { ChevronUpCircle, X } from 'lucide-react'
import { SidebarItemBtn } from '@repo/ui/components/data-table/sidebar-item-btn'

export function PriorityDropdown({ task, bigger }: { task: Task; bigger?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            buttonVariants({ variant: 'ghost', size: bigger ? 'sm' : 'fit' }),
            'justify-start gap-2 text-sm ',
            !!!task.priority && 'text-muted-foreground',
            !!task.priority && 'group/priority gap-1 text-foreground opacity-100',
            bigger && 'text-sm',
          )}
        >
          {bigger && (
            <div className="flex w-36 items-center gap-2">
              <ChevronUpCircle className="h-4 w-4 text-foreground" />
              Add Priority
            </div>
          )}

          {!!!task.priority && (
            <>
              {!bigger && <ChevronUpCircle className="h-4 w-4 text-foreground" />}
              <span>{bigger ? 'Empty' : 'Add Priority'}</span>
            </>
          )}

          {!!task.priority && (
            <>
              <Priority priority={task.priority} />

              <SidebarItemBtn
                Icon={X}
                className="invisible transition-all hover:text-red-500 group-hover/priority:visible"
              />
            </>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={bigger ? 'center' : 'start'} className="w-32">
        <DropdownMenuItem className="py-1">
          <Priority priority="low" />
        </DropdownMenuItem>
        <DropdownMenuItem className="py-1">
          <Priority priority="medium" />
        </DropdownMenuItem>
        <DropdownMenuItem className="py-1">
          <Priority priority="high" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
function Priority({ priority }: { priority: 'low' | 'medium' | 'high' }) {
  return (
    <div
      className={cn(
        'h-fit w-fit rounded-md px-2 py-0.5 text-xs font-medium capitalize ',

        priority === 'low' && 'bg-green-600 dark:bg-green-700',
        priority === 'medium' && 'bg-yellow-600 dark:bg-yellow-700',
        priority === 'high' && 'bg-red-600 dark:bg-red-700',
      )}
    >
      {priority}
    </div>
  )
}
