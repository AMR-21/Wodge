"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { SidebarItemBtn } from "../app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-item-btn";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { DialogClose } from "@/components/ui/dialog";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { MAX_OPTIONS, MIN_OPTIONS } from "@repo/data";
import { useCurrentRoomRep } from "@/hooks/use-room-rep";
import { useCurrentThreadRep } from "@/hooks/use-thread-rep";
import { toast } from "sonner";

export function PollMaker({ isRoom }: { isRoom: boolean }) {
  const [newOption, setNewOption] = useState<string>("");
  const [question, setQuestion] = useState("");

  const { workspaceRep } = useCurrentWorkspace();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [options, setOptions] = useState<string[]>([]);
  const newOptionRef = useRef<HTMLInputElement>(null);
  const rep = useCurrentRoomRep();
  const tRep = useCurrentThreadRep();

  const addNewOption = () => {
    if (newOption?.trim().length !== 0) {
      setOptions((prevOptions) => [...prevOptions, newOption]);
      setNewOption("");
    }
  };

  const deleteOption = (i: number) => {
    const arr = [...options];
    arr.splice(i, 1);
    setOptions(arr);
  };

  const { teamId } = useParams<{ teamId: string }>();

  const { user } = useCurrentUser();

  const canAdd = options.length < MAX_OPTIONS;
  const canSubmit =
    question.length > 0 &&
    options.length >= MIN_OPTIONS &&
    options.filter((option) => option.trim().length === 0).length === 0;

  return (
    <div className="">
      <div className="px-1">
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          placeholder="What's question you want to ask?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              newOptionRef.current?.focus();
            }
          }}
        />
      </div>

      <p className="px-1 pb-2 pt-4 text-sm">Answers</p>

      <ul className="flex max-h-72 flex-col space-y-4 overflow-y-auto p-1">
        {options.map((value, i) => (
          <li className="flex w-full items-center gap-2" key={i}>
            <Input
              type="text"
              name={`option-${i}`}
              className="h-7 disabled:cursor-default disabled:opacity-100"
              value={value}
              onChange={() => {}}
              disabled
            />
            <SidebarItemBtn
              iconClassName="size-5"
              Icon={Trash2}
              onClick={deleteOption.bind(null, i)}
              className="h-fit"
            />
          </li>
        ))}

        {canAdd && (
          <li className="flex gap-2">
            <Input
              ref={newOptionRef}
              type="text"
              name="option-new"
              placeholder="New option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newOption.length > 0) {
                    addNewOption();
                  }
                }
              }}
              className="h-7"
              // inRow
            />
            {/* <Button variant="secondary" size="sm" onClick={addNewOption}>
              Add
            </Button> */}
            <SidebarItemBtn
              className="h-fit"
              iconClassName="size-5"
              Icon={Plus}
              onClick={addNewOption}
            />
          </li>
        )}
      </ul>

      <Button
        variant="secondary"
        className="mt-2 w-full gap-2"
        size="sm"
        disabled={!canSubmit}
        onClick={async () => {
          try {
            if (!user) return;
            if (!isRoom)
              await tRep?.mutate.createPost({
                type: "poll",
                content: question,
                createdAt: new Date().toISOString(),
                author: user.id,
                id: nanoid(),
                pollOptions: options,
                votes: [],
                pollVoters: [],
                comments: [],
                reactions: [],
              });

            if (isRoom)
              await rep?.mutate.sendMessage({
                content: question,
                date: new Date().toISOString(),
                id: nanoid(),
                sender: user.id,
                type: "poll",
                pollOptions: options,
                pollVoters: [],
                votes: [],
                reactions: [],
              });

            closeRef.current?.click();
          } catch {
            toast.error("Failed to create poll");
          }
        }}
      >
        Create poll
      </Button>

      <DialogClose ref={closeRef} className="hidden" />
    </div>
  );
}
