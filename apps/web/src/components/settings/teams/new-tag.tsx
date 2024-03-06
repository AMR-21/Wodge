import { Tag, Team } from "@repo/data";
import { Button, Input } from "@repo/ui";
import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import { Row, Table } from "@tanstack/react-table";
import { produce } from "immer";
import { Check, Plus, X } from "lucide-react";
import * as React from "react";
import { DeepReadonly } from "replicache";

interface NewTagProps<TData> {
  handleNewTag: (tag: Tag) => void;
}

export function NewTag<TData>({ handleNewTag }: NewTagProps<TData>) {
  const [isEditing, setIsEditing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState("");

  function onClick() {
    if (!value) return;

    handleNewTag({
      name: value,
      color: "#1d4ed8",
    });

    setIsEditing(false);
    setValue("");
  }

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  if (isEditing)
    return (
      <div className="flex items-center gap-2 py-1.5">
        <Input
          ref={inputRef}
          inRow
          placeholder="Tag name"
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex">
          <SidebarItemBtn Icon={Check} onClick={onClick} success />
          <SidebarItemBtn
            key={"btn"}
            Icon={X}
            onClick={() => {
              setIsEditing(false);
              setValue("");
            }}
            destructive
          />
        </div>
      </div>
    );

  return (
    <div className="w-full p-1">
      <Button
        size="fit"
        variant="ghost"
        className="w-full justify-center gap-1 px-1.5 py-1.5"
        onClick={() => setIsEditing(true)}
      >
        <Plus className="h-4 w-4" />
        <span>New tag</span>
      </Button>
    </div>
  );
}
