import { Task } from "@repo/data";
import { createContext, useContext, useState } from "react";
import { DateRange } from "react-day-picker";

const Context = createContext<
  | {
      title: string | undefined;
      isEditing: boolean;
      setTitle: (title: string | undefined) => void;
      setIsEditing: (isEditing: boolean) => void;
      open: boolean;
    }
  | undefined
>(undefined);

export function TaskProvider({
  children,
  task,
  isEditing,
  setIsEditing,
  open,
}: {
  children: React.ReactNode;
  task: Task;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  open: boolean;
}) {
  const [title, setTitle] = useState(task?.title);
  const [assignee, setAssignee] = useState(task?.assignee || []);
  const [due, setDue] = useState(task?.due as DateRange | undefined);
  const [priority, setPriority] = useState(task?.priority);
  const [includeTime, setIncludeTime] = useState(task?.includeTime);

  if (task?.title !== title && (!isEditing || open)) {
    setTitle(task.title);
  }

  return (
    <Context.Provider
      value={{
        title,
        isEditing,
        setTitle,
        setIsEditing,
        open,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useTask() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}
