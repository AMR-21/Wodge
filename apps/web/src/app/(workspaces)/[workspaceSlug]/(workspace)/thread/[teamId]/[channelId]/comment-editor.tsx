import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { OfflineEditor, useThreadEditor } from "@repo/editor";
import { SafeAvatar } from "@repo/ui/components/safe-avatar";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { CheckCircle2, CircleDot, Send } from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { threadMutators } from "@repo/data";
import { Replicache } from "replicache";
import { cn } from "@repo/ui/lib/utils";
import { TooltipWrapper } from "@repo/ui/components/tooltip-wrapper";
import { Button } from "@repo/ui/components/ui/button";

export function CommentEditor({
  rep,
  isQA,
}: {
  rep?: Replicache<typeof threadMutators>;
  isQA?: boolean;
}) {
  const { user } = useCurrentUser();

  const editor = useThreadEditor({
    placeholder: isQA ? "Add an answer..." : "Add a comment...",
  });

  async function createComment() {
    const text = editor?.getHTML();
    if (!text || !user) return;

    await rep?.mutate.createThreadMessage({
      author: user.id,
      content: text,
      date: new Date().toISOString(),
      id: nanoid(),
      type: "message",
    });

    editor?.commands.clearContent();
  }

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex flex-1 shrink-0 flex-col rounded-md border border-border/50 bg-secondary/40 px-1.5 py-1.5">
        <div
          className="flex h-full w-full items-center"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              createComment();
            }
          }}
        >
          <SafeAvatar src={user?.avatar} className="mr-3 h-6 w-6 self-start" />
          <OfflineEditor editor={editor} isThread />
          <TooltipWrapper content={isQA ? "Send answer" : "Send comment"}>
            <SidebarItemBtn Icon={Send} className="self-start" />
          </TooltipWrapper>
        </div>
      </div>
    </div>
  );
}
