import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Column, pageMutators, Task } from "@repo/data";
import { Replicache } from "replicache";
import { DateRange } from "react-day-picker";
import { Editor } from "@tiptap/react";
import { TaskItem } from "./task-item";
import { TaskSheet } from "./task-sheet";
import { TaskProvider } from "./task-provider";

interface TaskCardProps {
  task: Task;
  index?: number;
  rep?: Replicache<typeof pageMutators>;
  col?: Column;
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

function TaskCard({ task, index, col, rep, editor }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <TaskProvider
      open={open}
      task={task}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger disabled={isDragging} asChild>
          <div>
            <TaskItem
              isAbove={isAbove}
              isBelow={isBelow}
              task={task}
              col={col}
              rep={rep}
              editor={editor}
              ref={setNodeRef}
              {...attributes}
              {...listeners}
            />
          </div>
        </SheetTrigger>
        <TaskSheet task={task} rep={rep} />
      </Sheet>
    </TaskProvider>
  );
}

export default TaskCard;
