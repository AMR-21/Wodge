import { SidebarItemBtn } from "@/app/(workspaces)/[workspaceSlug]/(workspace)/_components/sidebar-item-btn";
import { SafeAvatar } from "@/components/safe-avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useIsTeamModerator } from "@/hooks/use-is-team-moderator";
import { cn } from "@/lib/utils";
import { Image, Vote } from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { memo } from "react";
import { useThreadEditor } from "@/hooks/use-thread-editor";
import OfflineEditor from "@/components/editor/block-editor/offline-editor";

export function ThreadEditor({ isQA = false }: { isQA?: boolean }) {
  const { workspaceRep } = useCurrentWorkspace();
  const { user } = useCurrentUser();
  const { teamId } = useParams<{ teamId: string }>();

  const editor = useThreadEditor({
    placeholder: isQA ? "What's your question?" : "What's happening?",
  });

  const isPrivileged = useIsTeamModerator();

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
    <div
      className={cn(
        "flex shrink-0 flex-col rounded-md border border-border/50 bg-secondary/40 px-1.5 pb-1 pt-2.5",

        !isQA && !isPrivileged && "pt-1",
      )}
    >
      {!isQA && !isPrivileged && (
        <p className="text-muted-foreground">
          Only owner, admins, and moderators can post.
        </p>
      )}

      {(isQA || (!isQA && isPrivileged)) && (
        <>
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
            <SubmitButton
              isEmpty={editor?.isEmpty}
              createThread={createThread}
              isQA={isQA}
            />
          </div>
        </>
      )}
    </div>
  );
}

const SubmitButton = memo(
  ({
    isEmpty = true,
    createThread,
    isQA,
  }: {
    isEmpty?: boolean;
    isQA?: boolean;
    createThread: () => void;
  }) => {
    return (
      <Button
        size="fit"
        className="ml-auto w-20"
        disabled={isEmpty}
        onClick={createThread}
      >
        {isQA ? "Ask" : "Post"}
      </Button>
    );
  },
);
