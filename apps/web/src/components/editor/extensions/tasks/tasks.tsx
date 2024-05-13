import { useMemo, useRef } from "react";

import { Editor, NodeViewWrapper, NodeViewWrapperProps } from "@tiptap/react";
import { useCurrentPageRep } from "@/hooks/use-page-rep";
import { useSubscribe } from "@/hooks/use-subscribe";
import { ReadTransaction, Replicache } from "replicache";
import { Board, pageMutators, Task } from "@repo/data";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAtom } from "jotai";
import { boardsViews } from "./atom";
import { KanbanView } from "./kanban-view";
import { useTable } from "@/app/(workspaces)/[workspaceSlug]/settings/use-table";
import { tasksColumns } from "./tasks-table-columns";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { Plus } from "lucide-react";

export function Tasks({ editor, node, getPos }: NodeViewWrapperProps) {
  const rep = useCurrentPageRep();

  const { snapshot: boards } = useSubscribe(rep, (tx: ReadTransaction) =>
    tx.get<Board[]>("boards"),
  );

  const [boardViewAtom, setBoardViewAtom] = useAtom(boardsViews);

  const boardId = useRef(node.attrs["data-id"]).current;

  const board = useMemo(() => boards?.find((b) => b.id === boardId), [boards]);

  const boardView = boardViewAtom[boardId];

  if (!board) return null;
  return (
    <NodeViewWrapper
      // onClick={(e: React.MouseEvent) => {
      //   e.stopPropagation();
      // }}
      className="select-none"
    >
      <div className="flex w-full items-center gap-2 pb-4">
        <ToggleGroup
          defaultValue={boardView || "kanban"}
          value={boardView || "kanban"}
          onValueChange={(v) =>
            setBoardViewAtom({
              ...boardViewAtom,
              [boardId]: v as "kanban" | "table",
            })
          }
          type="single"
        >
          <ToggleGroupItem variant="outline" value="kanban">
            Kanban
          </ToggleGroupItem>
          <ToggleGroupItem value="table" variant="outline">
            Table
          </ToggleGroupItem>
        </ToggleGroup>
        {/* <span className="ml-auto">filters</span> */}
      </div>

      {boardView === "kanban" && (
        <KanbanView
          board={board as Board}
          editor={editor}
          boardId={boardId}
          rep={rep}
        />
      )}
      {boardView === "table" && (
        <TableView
          board={board as Board}
          rep={rep}
          boardId={boardId}
          editor={editor}
        />
      )}
    </NodeViewWrapper>
  );

  // function onDragOver(event: DragOverEvent) {
  //   const { active, over } = event;
  //   if (!over) return;
  //   const activeId = active.id;
  //   const overId = over.id;

  //   if (activeId === overId) return;

  //   const isActiveATask = active.data.current?.type === "Task";

  //   const isOverATask = over.data.current?.type === "Task";
  //   if (!isActiveATask) return;

  //   // Im dropping a Task over another Task
  //   if (
  //     isActiveATask &&
  //     isOverATask &&
  //     active.data.current?.task.columnId !== over.data.current?.task.columnId
  //   ) {
  //     // setTasks(tasks => {
  //     //   const activeIndex = tasks.findIndex(t => t.id === activeId)
  //     //   const overIndex = tasks.findIndex(t => t.id === overId)
  //     //   if (tasks[activeIndex]?.columnId != tasks[overIndex]?.columnId) {
  //     //     // Fix introduced after video recording
  //     //     if (tasks[activeIndex] && tasks[overIndex]) tasks[activeIndex].columnId = tasks[overIndex].columnId
  //     //     return arrayMove(tasks, activeIndex, overIndex - 1)
  //     //   }
  //     //   return arrayMove(tasks, activeIndex, overIndex)
  //     // })
  //   }

  //   const isOverAColumn = over.data.current?.type === "Column";
  //   // Im dropping a Task over a column
  //   if (isActiveATask && isOverAColumn) {
  //     // setTasks(tasks => {
  //     //   const activeIndex = tasks.findIndex(t => t.id === activeId)
  //     //   if (tasks[activeIndex]) tasks[activeIndex].columnId = overId as string
  //     //   console.log('DROPPING TASK OVER COLUMN', { activeIndex })
  //     //   return arrayMove(tasks, activeIndex, activeIndex)
  //     // })
  //   }
  // }
}

interface TableViewProps {
  board: Board;
  rep?: Replicache<typeof pageMutators>;
  boardId: string;
  editor?: Editor | null;
}
function TableView({ board, rep, boardId, editor }: TableViewProps) {
  const table = useTable({
    data: board.tasks || [],
    columns: tasksColumns({
      onDeleteTask: async (t) => {
        await rep?.mutate.deleteTask({
          task: t as Task,
          boardId,
        });
      },
      onEditTask: async (t) => {
        await rep?.mutate.editTask({
          boardId,
          task: t as Task,
        });
      },
      editor,
      board,
    }),
  });

  if (!board.tasks || board.tasks.length === 0)
    return (
      <div className="flex w-full items-center justify-center overflow-y-auto">
        <Button
          className="w-64 gap-2"
          variant="ghost"
          size="sm"
          onClick={async () => {
            // const col = board.columns?.[0] || ;
            const colId = nanoid(6);
            if (board.columns.length === 0) {
              await rep?.mutate.createColumn({
                boardId,
                id: colId,
                title: "New column",
              });
            }
            await rep?.mutate.createTask({
              boardId,
              col: board.columns?.[0]?.id || colId,
              task: {
                columnId: board.columns?.[0]?.id || colId,
                id: nanoid(6),
                includeTime: false,
              },
            });
          }}
        >
          <Plus className="h-4 w-4" />
          Add a task
        </Button>
      </div>
    );

  return (
    <div className="w-full overflow-y-auto  border-border">
      <div className="pb-4">
        <DataTable
          table={table.table}
          placeholder="No tasks found"
          className="border-none "
          withHeader
        />
      </div>
    </div>
  );
}
