import { SidebarItemBtn } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-item-btn";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn, focusElement } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
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
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import OfflineEditor from "../../block-editor/offline-editor";
import { useThreadEditor } from "@/hooks/use-thread-editor";
import { useAtomValue } from "jotai";
import { isSidebarOpenAtom } from "@/store/global-atoms";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { TaskState } from "./task-card";
import { toast } from "sonner";
interface TaskSheetProps {
  task: Task;
  boardId?: string;
  state: TaskState;
  col?: Column;
  rep?: Replicache<typeof pageMutators>;
}

export const TaskSheet = forwardRef<HTMLDivElement, TaskSheetProps>(
  ({ task, boardId, col, state, rep, ...props }, ref) => {
    const {
      assignee,
      due,
      priority,
      setAssignee,
      setDue,
      setPriority,
      setTitle,
      title,
      includeTime,
      setIncludeTime,
    } = state;

    const titleRef = useRef<HTMLParagraphElement>(null);

    const editor = useThreadEditor({
      content: task?.overview,
      placeholder: "Write something or / for commands",
    });

    const isSidebarOpen = useAtomValue(isSidebarOpenAtom);

    const [debouncedEditor] = useDebounce(editor?.state.doc.content, 500, {});

    const debounced = useDebouncedCallback((t: string) => {
      onEdit();
    }, 500);

    useEffect(() => {
      if (debouncedEditor) {
        onEdit();
      }
    }, [debouncedEditor]);

    useEditable(titleRef, async (t) => {
      setTitle(t);

      debounced(t);
    });

    async function onEdit() {
      if (!boardId) return;
      try {
        await rep?.mutate.editTask({
          boardId,
          task: {
            ...task,
            title,
            priority,
            assignee,
            due: due as Task["due"],
            overview: editor?.getJSON() as unknown as string,
            includeTime,
          },
        });
      } catch {
        toast.error("Failed to edit task");
      }
    }

    return (
      <SheetContent
        className={cn(
          "flex w-full flex-col gap-0 px-0 pb-0 pt-10 sm:w-3/4 sm:max-w-full md:w-3/5  lg:max-w-[31.25rem] 2xl:max-w-[46.875rem]",
          isSidebarOpen && " sm:max-w-[calc(100vw-15rem)]",
        )}
      >
        <SheetHeader>
          <SheetTitle
            ref={titleRef}
            className={cn(
              "mb-2 px-6 text-left text-2xl focus:outline-none",

              !title && "text-muted-foreground",
            )}
            suppressContentEditableWarning
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") return;
            }}
          >
            {title || "Untitled"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-1 px-3">
          <MemberMultiSelect
            bigger
            preset={assignee}
            onChange={(v) => {
              setAssignee(v);
              onEdit();
            }}
            isEditing
          />

          <DateTimePicker
            bigger
            onSetDate={(d) => {
              setDue(d);
              onEdit();
            }}
            setIncludeTime={(t) => {
              setIncludeTime(t);
              onEdit();
            }}
            date={due}
            isEditing
            includeTime={includeTime}
          />
          <PriorityDropdown
            bigger
            priority={priority}
            isEditing
            onSelect={(p) => {
              setPriority(p);
              onEdit();
            }}
          />
        </div>

        <p className="px-6 pb-2 pt-6 text-sm font-medium text-muted-foreground">
          Task overview
        </p>

        <div className="overflow-y-auto">
          <div className="px-6">
            <OfflineEditor editor={editor} className=" pl-0.5" isThread />
          </div>
        </div>
      </SheetContent>
    );
  },
);
