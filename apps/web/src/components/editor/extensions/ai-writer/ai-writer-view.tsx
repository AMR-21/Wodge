import {
  Extension,
  NodeViewWrapper,
  NodeViewWrapperProps,
} from "@tiptap/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { env } from "@repo/env";
import { useParams } from "next/navigation";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { Button } from "@/components/ui/button";
import { AiTone, AiToneOption } from "@/components/editor/block-editor/types";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { Prompt } from "@repo/data";
import { Panel, PanelHeadline } from "@/components/editor/ui/Panel";
import { Textarea } from "@/components/editor/ui/Textarea";
import { Icon } from "@/components/editor/ui/icon";
import { Check, Repeat, Sparkles, Trash2 } from "lucide-react";
import { tones } from "@/lib/utils";
import { useOnClickOutside } from "usehooks-ts";

import { useChat } from "ai/react";

export interface DataProps {
  text: string;
  addHeading: boolean;
  tone?: AiTone;
  textUnit?: string;
  textLength?: string;
  language?: string;
}

export const AiWriterView = ({
  editor,
  node,
  getPos,
  deleteNode,
}: NodeViewWrapperProps) => {
  const [text, setText] = useState("");

  const { workspaceId } = useCurrentWorkspace();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({
    api: `/api/workspaces/${workspaceId}/ai`,
  });

  const textareaId = useMemo(() => nanoid(), []);

  const insert = useCallback(() => {
    const from = getPos();
    const to = from + node.nodeSize;

    editor
      .chain()
      .focus()
      .insertContentAt({ from, to }, messages.at(-1)?.content)
      .run();
  }, [editor, messages, getPos, node.nodeSize]);

  const discard = useCallback(() => {
    deleteNode();
  }, [deleteNode]);

  const ref = useRef<HTMLDivElement>(null);

  const hasResponse = messages.length > 1 && messages.at(-1)?.role !== "user";
  useOnClickOutside(ref, () => {
    if (!isLoading && !hasResponse) discard();
  });

  if (!workspaceId) return null;

  return (
    <NodeViewWrapper data-drag-handle>
      <Panel noShadow className="w-full " ref={ref}>
        <div className="flex flex-col bg-dim p-1">
          {hasResponse && (
            <>
              <PanelHeadline>Preview</PanelHeadline>
              <div className="relative mb-4 ml-2.5 max-h-[14rem] overflow-y-auto border-l-4 border-neutral-100 bg-white px-4 text-base text-black dark:border-neutral-700 dark:bg-black dark:text-white">
                {messages.at(-1)?.content}
              </div>
            </>
          )}
          <div className="flex flex-row items-center justify-between gap-1">
            <PanelHeadline asChild>
              <label htmlFor={textareaId}>Prompt</label>
            </PanelHeadline>
          </div>
          <form onSubmit={handleSubmit}>
            <Textarea
              id={textareaId}
              value={input || text}
              onChange={(e) => {
                setText(e.target.value);
                handleInputChange(e);
              }}
              placeholder={"Tell me what you want me to write about."}
              required
              className="mb-2"
            />
            <div className="flex flex-row items-center justify-between gap-1">
              <div className="flex w-auto justify-between gap-1"></div>
              <div className="flex w-auto justify-between gap-1">
                {true && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      discard();
                    }}
                  >
                    <Icon Icon={Trash2} className="mr-1 shrink-0" />
                    Discard
                  </Button>
                )}
                {hasResponse && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      insert();
                    }}
                    disabled={!hasResponse}
                  >
                    <Icon Icon={Check} className="mr-1 shrink-0" />
                    Insert
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="default"
                  type="submit"
                  onClick={() => {
                    if (input === "" && text !== "") {
                      setInput(text);
                    }
                  }}
                  disabled={isLoading || (input === "" && text === "")}
                  style={{ whiteSpace: "nowrap" }}
                  isPending={isLoading}
                  className="w-36"
                >
                  {hasResponse ? (
                    <Icon Icon={Repeat} className="mr-1 shrink-0" />
                  ) : (
                    <Icon Icon={Sparkles} className="mr-1 shrink-0" />
                  )}
                  {hasResponse ? "Regenerate" : "Generate text"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Panel>
    </NodeViewWrapper>
  );
};
