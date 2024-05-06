import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { OfflineEditor, useThreadEditor } from "@repo/editor";
import { SafeAvatar } from "@repo/ui/components/safe-avatar";
import { Button } from "@repo/ui/components/ui/button";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { Image, Vote } from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";

export function ThreadEditor({ isQA = false }: { isQA?: boolean }) {
  const { workspaceRep } = useCurrentWorkspace();
  const { user } = useCurrentUser();
  const { teamId } = useParams<{ teamId: string }>();

  const editor = useThreadEditor({
    placeholder: isQA ? "What's your question?" : "What's happening?",
  });

  async function createThread() {
    const text = editor?.getHTML();
    if (!text || !user) return;

    await workspaceRep?.mutate.createThread({
      createdBy: user.id,
      content: text,
      id: nanoid(),
      teamId,
      type: isQA ? "qa" : "post",
      createdAt: new Date().toISOString(),
    });

    editor?.commands.clearContent();
  }

  return (
    <div className="flex shrink-0 flex-col rounded-md border border-border/50 bg-secondary/40 px-1.5 pb-1 pt-2.5">
      <div
        className="flex h-full w-full items-start"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            createThread();
          }
        }}
      >
        <SafeAvatar src={user?.avatar} className="mr-3 h-7 w-7" />
        <OfflineEditor editor={editor} isThread />
      </div>
      <div className="ml-0.5 flex items-center pl-8">
        <SidebarItemBtn
          className="p-1.5"
          Icon={Image}
          iconClassName="w-4 h-4 "
          onClick={() => {
            editor?.commands.setImageUpload();
          }}
        />
        {!isQA && (
          <SidebarItemBtn
            className="p-1.5"
            Icon={Vote}
            iconClassName="w-4 h-4"
          />
        )}
        <Button
          size="fit"
          className="ml-auto w-20"
          disabled={editor?.isEmpty}
          onClick={createThread}
        >
          {isQA ? "Ask" : "Post"}
        </Button>
      </div>
    </div>
  );
}
