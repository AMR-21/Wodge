import { memo, useMemo, useRef, useState } from "react";

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
import { KanbanIcon, ListFilter, Plus, Table, X } from "lucide-react";
import { toast } from "sonner";
import { TableView } from "./table-view";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { MemberMultiSelect } from "./member-multi-select";
import { DateTimePicker } from "./date-time-picker";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";

export function Tasks({ editor, node, getPos }: NodeViewWrapperProps) {
  const rep = useCurrentPageRep();

  const { snapshot: boards } = useSubscribe(rep, (tx: ReadTransaction) =>
    tx.get<Board[]>("boards"),
  );

  const [priority, setPriority] = useState("");
  const [title, setTitle] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [due, setDue] = useState<DateRange>();
  const [includeTime, setIncludeTime] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [boardViewAtom, setBoardViewAtom] = useAtom(boardsViews);

  const boardId = useRef(node.attrs["data-id"]).current;

  const board = useMemo(() => boards?.find((b) => b.id === boardId), [boards]);

  const boardView = boardViewAtom[boardId] || "kanban";

  return (
    <NodeViewWrapper className="select-none">
      <div className="flex w-full items-center gap-2 pb-2">
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
          <ToggleGroupItem variant="outline" size="sm" value="kanban">
            <KanbanIcon className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" size="sm" variant="outline">
            <Table className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Popover>
          <PopoverTrigger asChild></PopoverTrigger>

          <PopoverContent></PopoverContent>
        </Popover>

        <Toggle
          size="sm"
          variant="outline"
          pressed={isFilterOpen}
          onPressedChange={setIsFilterOpen}
        >
          <ListFilter
            className={cn(
              "size-4",
              (title || priority || assignees.length || due) &&
                "text-blue-500 dark:text-blue-600",
            )}
          />
        </Toggle>
      </div>

      <div
        className={cn(
          "invisible flex h-0 items-center gap-2",
          isFilterOpen && "visible h-[calc(100%)] pb-2 pt-1",
        )}
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <DateTimePicker
          isFilter
          isEditing
          date={due}
          onSetDate={setDue}
          includeTime={includeTime}
          setIncludeTime={setIncludeTime}
        />

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <MemberMultiSelect
          preset={assignees}
          isEditing
          onChange={setAssignees}
          icon={false}
        />

        <Button
          disabled={!title && !priority && !assignees.length && !due}
          className="px-1.5"
          onClick={() => {
            setTitle("");
            setPriority("");
            setAssignees([]);
            setDue(undefined);
          }}
          variant="outline"
          size="sm"
        >
          <X className="size-4" />
        </Button>
      </div>

      {boardView === "kanban" && (
        <KanbanView
          board={board as Board}
          editor={editor}
          boardId={boardId}
          rep={rep}
          priority={priority}
          title={title}
          assignees={assignees}
          due={due}
        />
      )}
      {boardView === "table" && (
        <TableView
          board={board as Board}
          rep={rep}
          boardId={boardId}
          editor={editor}
          priority={priority}
          title={title}
          assignees={assignees}
          due={due}
        />
      )}
    </NodeViewWrapper>
  );
}
