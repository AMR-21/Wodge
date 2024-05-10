import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useRef, useState } from "react";
import TaskCard, { Column, Task } from "./task-card";
import { Check, MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-react";
import { SidebarItemBtn } from "../../../_components/sidebar-item-btn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Input } from "@repo/ui/components/ui/input";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import { useDndContext } from "@dnd-kit/core";
import { atom, useAtomValue } from "jotai";
import { tempMoveId, tempMovesAtom } from "./atom";

interface Props {
  column: Column;
  deleteColumn: (id: string) => void;
  updateColumn: (id: string, title: string) => void;

  createTask: (columnId: string) => void;
  updateTask: (id: string, content: string) => void;
  deleteTask: (id: string) => void;
  tasks: Task[];
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);

  const tempMoves = useAtomValue(tempMovesAtom);
  const tempMoveIdV = useAtomValue(tempMoveId);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const ref = useRef<HTMLInputElement>(null);

  if (editMode) {
    ref.current?.focus();
  }

  return (
    <div ref={setNodeRef}>
      <div className="group flex w-80 flex-col rounded-md bg-secondary/30 p-2 transition-all">
        {/* Column title */}
        <div
          style={style}
          {...attributes}
          {...listeners}
          className="flex max-w-80 cursor-grab items-center pb-3"
        >
          <div className="flex w-full items-center gap-1">
            <Input
              ref={ref}
              className={cn(
                "mr-1 w-fit min-w-0 rounded border p-0 px-1 text-base font-medium outline-none focus-visible:border-none disabled:cursor-grab disabled:opacity-100",
              )}
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              // onBlur={() => {
              //   setEditMode(false);
              // }}
              // onKeyDown={(e) => {
              //   if (e.key !== "Enter") return;
              //   setEditMode(false);
              // }}
              disabled={!editMode}
              inRow
            />
            {/* <div className="text-sm text-muted-foreground transition-all group-hover:text-foreground">
                {tasks.length || 0}
              </div> */}
            {!editMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarItemBtn
                    Icon={MoreHorizontal}
                    className="invisible ml-auto transition-all group-hover:visible"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="gap-2 text-sm"
                    onClick={() => {
                      setEditMode(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 " />
                    Edit column
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="gap-2 text-sm text-red-500  focus:text-red-600 dark:focus:text-red-400"
                    onClick={() => {
                      deleteColumn(column.id);
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
                  className="ml-auto hover:text-green-600 dark:hover:text-green-500"
                  Icon={Check}
                />
                <SidebarItemBtn
                  className="hover:text-red-600 dark:hover:text-red-500"
                  Icon={X}
                  onClick={() => {
                    setEditMode(false);
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
              <TaskCard
                key={task.id}
                task={task}
                isFirst={i === 0}
                isLast={i === tasks.length - 1}
                index={i}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            ))}
          </SortableContext>
        </div>

        {/* Column footer */}

        <Button
          variant="ghost"
          className="mt-2 gap-1.5 opacity-70 transition-all hover:opacity-100"
          onClick={() => {
            createTask(column.id);
          }}
        >
          <Plus className="h-4 w-4 " />
          Add task
        </Button>
      </div>
    </div>
  );
}

export function ColumnTitle({ column }: { column: Column }) {
  return (
    <div className="group flex h-fit min-h-0 w-80 flex-col rounded-md bg-secondary/30 p-1.5 transition-all">
      <div className="flex  max-w-80  cursor-grab items-center pb-3">
        <div className="flex w-full items-center gap-1">
          <Input
            className={cn(
              "mr-1 w-fit min-w-0 rounded border p-0 px-1 text-base font-medium outline-none focus-visible:border-none disabled:cursor-grab disabled:opacity-100",
            )}
            value={column.title}
            onChange={(e) => {}}
            inRow
          />

          <SidebarItemBtn
            Icon={MoreHorizontal}
            className="invisible ml-auto transition-all group-hover:visible"
          />
        </div>
      </div>
    </div>
  );
}
export default ColumnContainer;
