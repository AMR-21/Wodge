import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDndContext,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard, { Column, Task } from "./task-card";
import ColumnContainer, { ColumnTitle } from "./column-container";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useSetAtom } from "jotai";
import { tempMoveId, tempMovesAtom } from "./atom";
import { nanoid } from "nanoid";

const defaultCols: Column[] = [];

const defaultTasks: Task[] = [];

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const setTempMoves = useSetAtom(tempMovesAtom);
  const setTempMoveId = useSetAtom(tempMoveId);

  const tasksByColumn = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => {
      map.set(t.columnId, [...(map.get(t.columnId) || []), t]);
    });
    return map;
  }, [tasks, columns]);

  return (
    <div className="flex w-full items-center overflow-x-auto overflow-y-auto border border-border p-4">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        modifiers={activeColumn ? [restrictToHorizontalAxis] : []}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>

          {/* <Button
            className="h-[60px] w-[350px] justify-start gap-2"
            variant="ghost"
          >
            <Plus className="h-4 w-4" />
            Add column
          </Button> */}
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
      flex 
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      gap-2
      rounded-lg
      border-2
      border-border
      bg-background
      p-4
      ring-rose-500
      hover:ring-2
      "
          >
            <Plus className="h-6 w-6" />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay dropAnimation={null}>
            {activeColumn && <ColumnTitle column={activeColumn} />}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: string) {
    const newTask: Task = {
      id: nanoid(6),
      columnId,
      includeTime: false,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: string) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: string, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function updateTaskTitle(id: string, title: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, title };
    });

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: string) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: string, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      //@ts-ignore
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      // @ts-ignore
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    setTempMoves([]);

    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isActiveColumn = active.data.current?.type === "Column";

    const isOverATask = over.data.current?.type === "Task";
    if (!isActiveATask && !isActiveColumn) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        if (tasks[activeIndex]?.columnId != tasks[overIndex]?.columnId) {
          // Fix introduced after video recording
          if (tasks[activeIndex] && tasks[overIndex])
            tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        if (tasks[activeIndex]) tasks[activeIndex].columnId = overId as string;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }

    if (isActiveColumn && isOverAColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeId,
        );

        const overColumnIndex = columns.findIndex((col) => col.id === overId);

        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";

    const isOverATask = over.data.current?.type === "Task";
    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (
      isActiveATask &&
      isOverATask &&
      active.data.current?.task.columnId !== over.data.current?.task.columnId
    ) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        if (tasks[activeIndex]?.columnId != tasks[overIndex]?.columnId) {
          // Fix introduced after video recording
          if (tasks[activeIndex] && tasks[overIndex])
            tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        if (tasks[activeIndex]) tasks[activeIndex].columnId = overId as string;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return `${Math.floor(Math.random() * 10001)}`;
}

export default KanbanBoard;
