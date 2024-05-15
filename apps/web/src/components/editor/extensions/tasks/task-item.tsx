import { SidebarItemBtn } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-item-btn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, focusElement } from "@/lib/utils";

import { Column, pageMutators, Task } from "@repo/data";
import { Editor } from "@tiptap/react";
import { Check, MoreHorizontal, PencilLine, Trash2, X } from "lucide-react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { Replicache } from "replicache";
import { useEditable } from "use-editable";
import { MemberMultiSelect } from "./member-multi-select";
import { DateTimePicker } from "./date-time-picker";
import { PriorityDropdown } from "./priority-dropdown";
import { TaskState } from "./task-card";
import { toast } from "sonner";

interface TaskItemProps {
  task: Task;
  boardId?: string;
  col?: Column;
  rep?: Replicache<typeof pageMutators>;
  editor?: Editor | null;

  state: TaskState;
}

export const TaskItem = forwardRef<HTMLDivElement, TaskItemProps>(
  ({ task, boardId, col, rep, editor, state, ...props }, ref) => {
    const {
      isAbove,
      isBelow,
      assignee,
      due,
      isEditing,
      priority,
      setAssignee,
      setDue,
      setIsEditing,
      setPriority,
      setTitle,
      title,
      includeTime,
      setIncludeTime,
    } = state;

    const titleRef = useRef<HTMLParagraphElement>(null);

    useEditable(titleRef, setTitle, {
      disabled: !isEditing,
    });

    useEffect(() => {
      editor?.setEditable(!isEditing);
      if (isEditing && titleRef.current) {
        focusElement(titleRef);
      }
    }, [isEditing]);

    async function onEdit() {
      try {
        if (!boardId) return;

        await rep?.mutate.editTask({
          boardId,
          task: {
            ...task,
            title,
            due: due as Task["due"],
            assignee,
            priority,
            includeTime,
          },
        });

        setIsEditing(false);
      } catch {
        toast.error("Failed to edit task");
      }
    }
    return (
      <div
        ref={ref}
        onClick={(e) => {
          if (isEditing) e.stopPropagation();
        }}
        className="group/task relative flex h-fit max-h-36 flex-col rounded-md bg-background p-2.5 text-sm hover:bg-background/65 "
        {...props}
        aria-disabled={isEditing}
      >
        <div
          className={cn(
            "invisible absolute -top-0 left-1/2 h-1.5 w-[99%] -translate-x-1/2  -translate-y-full rounded-sm bg-sky-500/30 transition-all dark:bg-sky-900/30",
            isAbove && "visible",
          )}
        />
        <div
          className={cn(
            "invisible absolute bottom-0 left-0 h-1.5 w-full translate-y-full rounded-sm bg-sky-500/30 transition-all dark:bg-sky-900/30",
            isBelow && "visible",
          )}
        />
        <div className="flex h-full items-center">
          <p
            ref={titleRef}
            suppressContentEditableWarning
            className={cn(
              "!my-0 max-h-32 w-full overflow-hidden  truncate break-words p-1 text-base font-medium focus:outline-none",
              isEditing && "cursor-text",
              !title && !isEditing && "text-muted-foreground",
            )}
            onKeyDown={async (e) => {
              if (isEditing && e.key === "Enter") {
                onEdit();
              }
            }}
            autoFocus
          >
            {title || "Untitled"}
          </p>

          {isEditing ? (
            <>
              <SidebarItemBtn
                className="ml-auto hover:text-green-600 dark:hover:text-green-500"
                Icon={Check}
                onClick={onEdit}
              />
              <SidebarItemBtn
                className="hover:text-red-600 dark:hover:text-red-500"
                Icon={X}
                onClick={() => {
                  setIsEditing(false);
                  setTitle(task?.title);
                  setDue(task?.due as DateRange | undefined);
                  setAssignee(task?.assignee);
                  setPriority(task?.priority);
                }}
              />
            </>
          ) : (
            <>
              <SidebarItemBtn
                Icon={PencilLine}
                onClick={setIsEditing.bind(null, true)}
                className="invisible ml-auto transition-all group-hover/task:visible"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarItemBtn
                    Icon={MoreHorizontal}
                    className="invisible my-0.5 transition-all group-hover/task:visible"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DropdownMenuItem
                    destructive
                    disclosure
                    onDisclosureConfirm={async () => {
                      try {
                        if (!boardId) return;
                        await rep?.mutate.deleteTask({
                          task,
                          boardId,
                        });
                      } catch {
                        toast.error("Failed to delete task");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        <div
          className="flex flex-col gap-0.5"
          onClick={(e) => {
            if (isEditing) e.stopPropagation();
          }}
        >
          {((assignee && assignee.length > 0) || isEditing) && (
            <MemberMultiSelect
              onChange={setAssignee}
              preset={assignee}
              isEditing={isEditing}
            />
          )}
          {(due || isEditing) && (
            <DateTimePicker
              date={due}
              onSetDate={setDue}
              isEditing={isEditing}
              includeTime={includeTime}
              setIncludeTime={setIncludeTime}
            />
          )}
          {(priority || isEditing) && (
            <PriorityDropdown
              onSelect={setPriority}
              priority={priority}
              isEditing={isEditing}
            />
          )}
        </div>
      </div>
    );
  },
);
