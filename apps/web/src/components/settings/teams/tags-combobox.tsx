import * as React from "react";
import { DrObj, Tag as TagType } from "@repo/data";
import _ from "lodash";
import { NewTag } from "./new-tag";
import { ComboboxCell, CommandItem, Tag } from "@repo/ui";
import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import { X } from "lucide-react";

interface TagComboBoxProps {
  tags: readonly DrObj<TagType>[];
  handleDeleteTag: (tagName: string) => void;
  handleNewTag: (tag: TagType) => void;
}

export function TagsComboBox({
  tags,
  handleDeleteTag,
  handleNewTag,
}: TagComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <ComboboxCell
      open={open}
      onOpenChange={setOpen}
      renderer={
        <div className=" flex gap-0.5 overflow-hidden">
          {tags?.map((tag, i) => (
            <Tag key={i} name={tag.name} color={tag.color} />
          ))}
        </div>
      }
      placeholder="Search for tags"
      emptyMsg="No tags found"
      label="tags"
      className="w-[240px]"
      nData={tags?.length}
    >
      {tags?.map((tag, i) => (
        <CommandItem key={i} value={tag.name} className="flex justify-between">
          <Tag name={tag.name} color={tag.color} noBg />
          <SidebarItemBtn
            Icon={X}
            destructive
            side="right"
            description="Delete tag"
            onClick={handleDeleteTag.bind(null, tag.name)}
          />
        </CommandItem>
      ))}

      <CommandItem className="px-0 py-0 hover:bg-transparent aria-selected:bg-transparent">
        <NewTag handleNewTag={handleNewTag} />
      </CommandItem>
    </ComboboxCell>
  );
}
