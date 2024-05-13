import { Board, DrObj, Member, PublicUserType, Task } from "@repo/data";
import { queryClient } from "@repo/data/lib/query-client";

import { SelectItem } from "@/components/ui/select";
import { useMember } from "@/hooks/use-member";
import { ColumnDef } from "@tanstack/react-table";
import { DeepReadonly } from "replicache";
import { Header } from "@/components/data-table/header";
import { useEditable } from "use-editable";
import { useEffect, useRef, useState } from "react";
import { cn, focusElement, Mutable } from "@/lib/utils";
import { SidebarItemBtn } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-item-btn";
import { Check, ChevronDown, PencilLine, X } from "lucide-react";
import { Editor } from "@tiptap/react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { MemberMultiSelect } from "./member-multi-select";
import { DateTimePicker } from "./date-time-picker";
import { DateRange } from "react-day-picker";
import { PriorityDropdown } from "./priority-dropdown";
import { DataTableActions } from "@/components/data-table/data-table-action";
interface TasksColumnsProps {
  onDeleteTask: (task: Task | DrObj<Task>) => void;
  onEditTask: (task: Task | DrObj<Task>) => void;
  editor?: Editor | null;
  board: DrObj<Board>;
}

export function tasksColumns({
  onDeleteTask,
  onEditTask,
  editor,
  board,
}: TasksColumnsProps): ColumnDef<DeepReadonly<Task>>[] {
  return [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <div className="flex items-center">
    //       <Checkbox
    //         checked={
    //           table.getIsAllPageRowsSelected() ||
    //           (table.getIsSomePageRowsSelected() && "indeterminate")
    //         }
    //         onCheckedChange={(value) =>
    //           table.toggleAllPageRowsSelected(!!value)
    //         }
    //         aria-label="Select all"
    //       />
    //     </div>
    //   ),
    //   cell: ({ row }) => (
    //     <div className="flex items-center">
    //       <Checkbox
    //         checked={row.getIsSelected()}
    //         onCheckedChange={(value) => row.toggleSelected(!!value)}
    //         aria-label="Select row"
    //       />
    //     </div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },

    {
      id: "title",
      header: () => <Header className="!text-sm !font-medium">Title</Header>,

      cell: ({ row }) => {
        const [title, setTitle] = useState<string | undefined>(
          row.original.title,
        );
        const titleRef = useRef<HTMLParagraphElement>(null);

        const [isEditing, setIsEditing] = useState(false);

        useEditable(titleRef, setTitle, {
          disabled: !isEditing,
        });

        useEffect(() => {
          editor?.setEditable(!isEditing);
          if (isEditing && titleRef.current) {
            focusElement(titleRef);
          }
        }, [isEditing]);

        return (
          <div className="group/task flex h-full w-full max-w-64 items-center ">
            <p
              ref={titleRef}
              suppressContentEditableWarning
              className={cn(
                "!my-0 overflow-hidden truncate break-words p-1 text-sm font-medium focus:outline-none",
                isEditing && "cursor-text",
                !title && !isEditing && "text-muted-foreground",
              )}
              onKeyDown={async (e) => {
                if (isEditing && e.key === "Enter") {
                  onEditTask({ ...row.original, title });
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
                  onClick={() => {
                    onEditTask({ ...row.original, title });
                  }}
                />
                <SidebarItemBtn
                  className="hover:text-red-600 dark:hover:text-red-500"
                  Icon={X}
                  onClick={() => {
                    setIsEditing(false);
                    setTitle(row.original.title);
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
              </>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      header: () => <Header className=" !text-sm !font-medium">Status</Header>,
      cell: ({ row }) => {
        const col = board.columns?.find((c) => c.id === row.original.columnId);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "fit",
                  }),

                  "max-w-32 gap-1.5",
                )}
              >
                {col?.title}

                <ChevronDown className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-fit">
              {board.columns?.map((col) => (
                <DropdownMenuItem
                  key={col.id}
                  onSelect={() => {
                    onEditTask({ ...row.original, columnId: col.id });
                  }}
                >
                  {col.title}
                </DropdownMenuItem>
              )) || []}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "assignee",
      header: () => (
        <Header className="pl-1 !text-sm !font-medium">Assignee</Header>
      ),

      cell: ({ row }) => {
        const [open, setOpen] = useState(false);

        useEffect(() => {
          if (open) {
            editor?.setEditable(false);
          }
        }, [open]);
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <MemberMultiSelect
              preset={row.original.assignee as Mutable<string[]>}
              onChange={(assignee) => {
                onEditTask({ ...row.original, assignee });
              }}
              open={open}
              setOpen={setOpen}
              isEditing
            />
          </div>
        );
      },
    },
    {
      id: "due",
      header: () => <Header className="pl-1 !text-sm !font-medium">Due</Header>,

      cell: ({ row }) => {
        return (
          <DateTimePicker
            date={row.original.due as DateRange | undefined}
            onSetDate={(due) => {
              onEditTask({ ...row.original, due: due as Task["due"] });
            }}
            includeTime={row.original.includeTime}
            setIncludeTime={(includeTime) => {
              onEditTask({ ...row.original, includeTime });
            }}
            isEditing
          />
        );
      },
    },
    {
      id: "priority",
      header: () => (
        <Header className="pl-1 !text-sm !font-medium">Priority</Header>
      ),

      cell: ({ row }) => {
        return (
          <PriorityDropdown
            priority={row.original.priority}
            onSelect={(priority) => {
              onEditTask({ ...row.original, priority });
            }}
            isEditing
          />
        );
      },
    },

    {
      id: "actions",
      cell: ({ row, table }) => {
        const member = row.original;

        return (
          <DataTableActions
            row={row}
            table={table}
            menuItems={[
              {
                label: "Delete task",
                action: () => {
                  // removeMember(member.id);
                  onDeleteTask(row.original);
                },
                destructive: true,
                // disabled: member.role === "owner",
              },
            ]}
          />
        );
      },
    },
  ];
}
