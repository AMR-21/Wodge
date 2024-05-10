import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, Check, ChevronUpCircle, MoreHorizontal, Pencil, Trash2, Users2, X } from 'lucide-react'
import { MemberMultiSelect } from './member-multi-select'
import { cn } from '@repo/ui/lib/utils'
import { buttonVariants } from '@repo/ui/components/ui/button'
import { DateTimePicker } from './date-time-picker'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import { PriorityDropdown } from './priority-dropdown'
import { Input, inputVariants } from '@repo/ui/components/ui/input'
import { DateRange } from 'react-day-picker'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@repo/ui/components/ui/sheet'
import { ScrollArea } from '@repo/ui/components/ui/scroll-area'
import { OfflineEditor, useThreadEditor } from '../../..'
import { SidebarItemBtn } from '@repo/ui/components/data-table/sidebar-item-btn'
import { DrObj, Task } from '@repo/data'

interface Props {
  task: Task | DrObj<Task>
  deleteTask: (id: string, colId: string) => void
  updateTask: (id: string, colId: string, content: string) => void
  isFirst?: boolean
  isLast?: boolean
  index?: number
}
export type Mutable<Type> = {
  -readonly [Key in keyof Type]: Type[Key]
}
function TaskCard({ task, deleteTask, updateTask, isLast, index }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const editor = useThreadEditor({
    content: task.content,
    placeholder: 'Write something or press / for commands',
  })

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,

    over,
    overIndex,
    index: curIndex,
    activeIndex,
    active,
    newIndex,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
      index,
    },
    disabled: editMode,
  })

  const isTaskOver = over?.id === task.id && over?.data.current?.type === 'Task'

  const isAbove = isTaskOver && activeIndex > curIndex
  const isBelow = isTaskOver && activeIndex < curIndex

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const toggleEditMode = () => {
    setEditMode(prev => !prev)
    setMouseIsOver(false)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          ref={setNodeRef}
          // style={style}
          {...attributes}
          {...listeners}
          className="relative flex h-fit max-h-36 flex-col  rounded-md  bg-background p-2.5 text-sm hover:bg-background/65 "
        >
          <div
            className={cn(
              'invisible absolute -top-0 left-1/2 h-1.5 w-[99%] -translate-x-1/2  -translate-y-full rounded-sm bg-sky-500/30 transition-all dark:bg-sky-900/30',
              isAbove && 'visible',
            )}
          />
          <div
            className={cn(
              'invisible absolute bottom-0 left-0 h-1.5 w-full translate-y-full rounded-sm bg-sky-500/30 transition-all dark:bg-sky-900/30',
              isBelow && 'visible',
            )}
          />
          <div className="mb-1 flex">
            {editMode ? (
              <Input
                ref={inputRef}
                className={cn(
                  'mr-1 w-fit min-w-0 rounded border p-0 px-1 text-base font-medium shadow-none outline-none focus-visible:border-none disabled:cursor-grab disabled:opacity-100',
                )}
                value={task.content || 'Title'}
                onChange={e => {
                  // updateTask(task.id, e.target.value);
                }}
                autoFocus
                disabled={!editMode}
                inRow
              />
            ) : (
              <p
                className={cn(
                  inputVariants(),
                  'mr-1 w-fit min-w-0 select-none rounded border p-0 px-1 text-base font-medium shadow-none outline-none focus-visible:border-none disabled:cursor-grab disabled:opacity-100',
                  'h-auto min-w-28 truncate border-none bg-transparent focus-visible:border-none',
                )}
              >
                {task.content}
              </p>
            )}

            {editMode ? (
              <>
                <SidebarItemBtn
                  className="ml-auto mr-1 hover:text-green-600 dark:hover:text-green-500"
                  Icon={Check}
                  onClick={toggleEditMode}
                />
                <SidebarItemBtn
                  className="hover:text-red-600 dark:hover:text-red-500"
                  Icon={X}
                  onClick={toggleEditMode}
                />
              </>
            ) : (
              <>
                <SidebarItemBtn Icon={Pencil} className="ml-auto mr-1" onClick={toggleEditMode} />
                <SidebarItemBtn Icon={MoreHorizontal} className="" />
              </>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            {(task.assignee || editMode) && <MemberMultiSelect preset={task.assignee as string[]} />}
            {(task.due || editMode) && <DateTimePicker preset={task.due as Task['due']} />}
            {(task.priority || editMode) && <PriorityDropdown task={task} />}
          </div>
        </div>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col pb-3 sm:max-w-lg">
        <ScrollArea>
          <SheetHeader>
            <SheetTitle
              className="mb-2 px-3 text-xl focus:outline-none"
              contentEditable={true}
              //@ts-ignore
              onInput={e => console.log(e.target.innerText)}
              suppressContentEditableWarning
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
            >
              {task.content}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-1">
            <MemberMultiSelect bigger preset={task.assignee as string[]} />

            <DateTimePicker bigger preset={task.due as Task['due']} />
            <PriorityDropdown bigger task={task} />
          </div>

          <p className="px-3 py-4 text-sm text-muted-foreground">Description</p>

          <div className="px-3">
            <OfflineEditor editor={editor} className="max-h-full" />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default TaskCard
