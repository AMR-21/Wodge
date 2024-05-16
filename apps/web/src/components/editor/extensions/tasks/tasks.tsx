import { memo, useMemo, useRef } from "react";

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
import { toast } from "sonner";
import { TableView } from "./table-view";

export function Tasks({ editor, node, getPos }: NodeViewWrapperProps) {
  const rep = useCurrentPageRep();

  const { snapshot: boards } = useSubscribe(rep, (tx: ReadTransaction) =>
    tx.get<Board[]>("boards"),
  );

  const [boardViewAtom, setBoardViewAtom] = useAtom(boardsViews);

  const boardId = useRef(node.attrs["data-id"]).current;

  const board = useMemo(() => boards?.find((b) => b.id === boardId), [boards]);

  const boardView = boardViewAtom[boardId] || "kanban";

  return (
    <NodeViewWrapper className="select-none">
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
        <span className="ml-auto">filters</span>
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
}
