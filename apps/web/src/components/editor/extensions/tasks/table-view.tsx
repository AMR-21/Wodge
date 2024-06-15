import { useTable } from "@/app/(workspaces)/[workspaceSlug]/settings/use-table";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Board, pageMutators, Task } from "@repo/data";
import { Editor } from "@tiptap/react";
import { Plus } from "lucide-react";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { Replicache } from "replicache";
import { toast } from "sonner";
import { tasksColumns } from "./tasks-table-columns";

interface TableViewProps {
  board: Board;
  rep?: Replicache<typeof pageMutators>;
  boardId: string;
  editor?: Editor | null;
  priority?: string;
  title?: string;
  assignees?: string[];
}
export function TableView({
  board,
  rep,
  boardId,
  editor,
  priority,
  title,
  assignees,
}: TableViewProps) {
  const tasks = useMemo(() => {
    let tasks = board?.tasks || [];
    if (priority) tasks = tasks.filter((t) => t.priority === priority);

    if (title)
      tasks = tasks.filter((t) =>
        t.title?.toLowerCase().includes(title.toLowerCase()),
      );

    if (assignees?.length)
      tasks = tasks.filter((t) =>
        t.assignee?.some((a) => assignees.includes(a)),
      );

    return tasks;
  }, [board, title, priority, assignees]);

  const table = useTable({
    data: tasks,
    columns: tasksColumns({
      onDeleteTask: async (t) => {
        try {
          await rep?.mutate.deleteTask({
            task: t as Task,
            boardId,
          });
        } catch {
          toast.error("Failed to delete task");
        }
      },
      onEditTask: async (t) => {
        try {
          await rep?.mutate.editTask({
            boardId,
            task: t as Task,
          });
        } catch {
          toast.error("Failed to edit task");
        }
      },
      editor,
      board,
      rep,
    }),
  });

  return (
    <div className="w-full overflow-y-auto  border-border">
      <div className="pb-4">
        <DataTable table={table.table} withHeader />

        <Button
          className="mt-2 w-full gap-2"
          variant="ghost"
          size="sm"
          onClick={async () => {
            // const col = board.columns?.[0] || ;
            try {
              const colId = nanoid(6);
              if (!board?.columns || board?.columns?.length === 0) {
                await rep?.mutate.createColumn({
                  boardId,
                  id: colId,
                  title: "New column",
                });
              }
              await rep?.mutate.createTask({
                boardId,
                col: board?.columns?.[0]?.id || colId,
                task: {
                  columnId: board?.columns?.[0]?.id || colId,
                  id: nanoid(6),
                  includeTime: false,
                },
              });
            } catch {
              toast.error("Failed to add task");
            }
          }}
        >
          <Plus className="h-4 w-4" />
          Add a task
        </Button>
      </div>
    </div>
  );
}
