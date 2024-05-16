import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MemberMultiSelect } from "./member-multi-select";
import { cn, focusElement } from "@/lib/utils";
import { DateTimePicker } from "./date-time-picker";
import { PriorityDropdown } from "./priority-dropdown";
import { Input, inputVariants } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Column, DrObj, pageMutators, Task } from "@repo/data";
import { useThreadEditor } from "../../../../hooks/use-thread-editor";
import { SidebarItemBtn } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-item-btn";
import {
  Check,
  MoreHorizontal,
  PanelRight,
  PanelRightOpen,
  Pencil,
  PencilLine,
  Trash2,
  X,
} from "lucide-react";
import OfflineEditor from "../../block-editor/offline-editor";
import { useEditable } from "use-editable";
import { Replicache } from "replicache";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";
import { set } from "lodash";
import { Editor } from "@tiptap/react";
import { TaskItem } from "./task-item";
import { TaskSheet } from "./task-sheet";

interface TaskCardProps {
  task: Task;
  index?: number;
  rep?: Replicache<typeof pageMutators>;
  col?: Column;
  boardId?: string;
  editor?: Editor;
}

export interface TaskState {
  due: DateRange | undefined;
  title: string | undefined;
  assignee: string[] | undefined;
  priority: Task["priority"] | undefined;
  includeTime: boolean;
  isEditing: boolean;
  setDue: (due: DateRange | undefined) => void;
  setTitle: (title: string | undefined) => void;
  setAssignee: (assignee: string[] | undefined) => void;
  setPriority: (priority: Task["priority"] | undefined) => void;
  setIsEditing: (isEditing: boolean) => void;
  setIncludeTime: (includeTime: boolean) => void;

  isAbove?: boolean;
  isBelow?: boolean;
}

function TaskCard({ boardId, task, index, col, rep, editor }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [due, setDue] = useState<DateRange | undefined>(
    task?.due as DateRange | undefined,
  );

  const [title, setTitle] = useState<string | undefined>(task?.title);

  const [assignee, setAssignee] = useState<string[] | undefined>(
    task?.assignee || [],
  );

  const [priority, setPriority] = useState<Task["priority"] | undefined>(
    task?.priority,
  );

  const [includeTime, setIncludeTime] = useState(task.includeTime);

  // console.log({ task });
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    over,
    index: curIndex,
    activeIndex,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
      index,
    },
    disabled: isEditing,
  });

  const isTaskOver =
    over?.id === task.id && over?.data.current?.type === "Task";

  const isAbove = isTaskOver && activeIndex > curIndex;
  const isBelow = isTaskOver && activeIndex < curIndex;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const state = {
    due,
    title,
    assignee,
    priority,
    isEditing,
    setDue,
    setTitle,
    setAssignee,
    setPriority,
    setIsEditing,
    isAbove,
    isBelow,
    includeTime,
    setIncludeTime,
  };

  return (
    <Sheet>
      <SheetTrigger disabled={isDragging} asChild>
        <div>
          <TaskItem
            state={state}
            task={task}
            boardId={boardId}
            col={col}
            rep={rep}
            editor={editor}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
          />
        </div>
      </SheetTrigger>
      <TaskSheet state={state} task={task} boardId={boardId} rep={rep} />
    </Sheet>
  );
}

export default TaskCard;
