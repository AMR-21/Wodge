import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useMemo, useRef, useState } from 'react'
import TaskCard from './task-card'
import { Check, MoreHorizontal, Pencil, Plus, Trash2, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu'
import { Input } from '@repo/ui/components/ui/input'
import { cn } from '@repo/ui/lib/utils'
import { Button } from '@repo/ui/components/ui/button'
import { SidebarItemBtn } from '@repo/ui/components/data-table/sidebar-item-btn'
import { Column, DrObj, pageMutators, Task } from '@repo/data'
import { Replicache } from 'replicache'
import { nanoid } from 'nanoid'
import { Editor } from '@tiptap/react'

interface Props {
  column: Column | DrObj<Column>
  tasks: Task[] | DrObj<Task>[]
  boardId: string
  editor: Editor
  rep?: Replicache<typeof pageMutators>
}

import { useEditable } from 'use-editable'

function ColumnContainer({ column, tasks, rep, boardId, editor }: Props) {
  const [editMode, setEditMode] = useState(false)

  const [name, setName] = useState(column.title)

  const tasksIds = useMemo(() => {
    return tasks.map(task => task.id)
  }, [tasks])

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const ref = useRef<HTMLParagraphElement>(null)

  const edit = useEditable(ref, setName, {
    disabled: !editMode,
  })

  useEffect(() => {
    editor?.setEditable(!editMode)

    if (editMode && ref.current) {
      const range = document.createRange()
      const selection = window.getSelection()
      range.setStart(ref.current, ref.current.childNodes.length)
      range.collapse(true)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [editMode])

  async function editColumn(e: React.KeyboardEvent<HTMLParagraphElement>) {
    if (editMode && e.key === 'Enter') {
      await rep?.mutate.updateColumn({
        boardId,
        ...column,
        title: name,
      })

      setEditMode(false)
    }
  }

  return (
    <div ref={setNodeRef}>
      <div className="group flex w-80 flex-col rounded-md bg-secondary/30 p-2 transition-all select-none">
        {/* Column title */}
        <div style={style} {...attributes} {...listeners} className="flex max-w-80 cursor-grab items-center pb-3">
          <div className="flex w-full items-start gap-1">
            <p
              ref={ref}
              // contentEditable={editMode}
              suppressContentEditableWarning
              className={cn(
                'overflow-hidden font-medium focus:outline-none break-words max-h-32 truncate pr-1',
                editMode && 'cursor-text',
              )}
              onKeyDown={async e => {
                if (editMode && e.key === 'Enter') {
                  await rep?.mutate.updateColumn({
                    boardId,
                    ...column,
                    title: name,
                  })

                  setEditMode(false)
                }
              }}
              autoFocus
            >
              {name}
            </p>
            <div className="text-sm text-muted-foreground transition-all group-hover:text-foreground py-1">
              {tasks.length || 0}
            </div>
            {!editMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarItemBtn
                    Icon={MoreHorizontal}
                    className="invisible my-0.5 ml-auto transition-all group-hover:visible"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="gap-2 text-sm"
                    onClick={() => {
                      setEditMode(true)
                    }}
                  >
                    <Pencil className="h-4 w-4 " />
                    Edit column
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="gap-2 text-sm text-red-500  focus:text-red-600 dark:focus:text-red-400"
                    onClick={async () => {
                      await rep?.mutate.deleteColumn({
                        boardId,
                        ...column,
                      })
                      // deleteColumn(column.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete column
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {editMode && (
              <>
                <SidebarItemBtn
                  className="ml-auto hover:text-green-600 dark:hover:text-green-500 my-0.5"
                  Icon={Check}
                  onClick={async () => {
                    await rep?.mutate.updateColumn({
                      boardId,
                      ...column,
                      title: name,
                    })

                    setEditMode(false)
                  }}
                />
                <SidebarItemBtn
                  className="hover:text-red-600 my-0.5 dark:hover:text-red-500"
                  Icon={X}
                  onClick={() => {
                    setName(column.title)

                    setEditMode(false)
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Column task container */}
        <div className="flex flex-col gap-1.5  ">
          <SortableContext items={tasksIds}>
            {tasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </SortableContext>
        </div>

        {/* Column footer */}

        <Button
          variant="ghost"
          className="mt-2 gap-1.5 opacity-70 transition-all hover:opacity-100"
          onClick={async () => {
            await rep?.mutate.createTask({
              boardId,
              col: column,
              task: {
                columnId: column.id,
                id: nanoid(6),
                includeTime: false,
              },
            })
            // createTask(column.id)
          }}
        >
          <Plus className="h-4 w-4 " />
          Add task
        </Button>
      </div>
    </div>
  )
}

export function ColumnTitle({ column }: { column: Column }) {
  return (
    <div className="group flex h-fit min-h-0 w-80 flex-col rounded-md bg-secondary/30 p-1.5 transition-all">
      <div className="flex  max-w-80  cursor-grab items-center pb-3">
        <div className="flex w-full items-center gap-1">
          <Input
            className={cn(
              'mr-1 w-fit min-w-0 rounded border p-0 px-1 text-base font-medium outline-none focus-visible:border-none disabled:cursor-grab disabled:opacity-100',
            )}
            value={column.title}
            onChange={e => {}}
            inRow
          />

          <SidebarItemBtn Icon={MoreHorizontal} className="invisible ml-auto transition-all group-hover:visible" />
        </div>
      </div>
    </div>
  )
}
export default ColumnContainer
