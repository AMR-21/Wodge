import OfflineEditor from "@/components/editor/block-editor/offline-editor";
import { UploadButton } from "../../upload-button";
import { SidebarItemBtn } from "../../../_components/sidebar-item-btn";
import { Send } from "lucide-react";
import { useMessageEditor } from "@/hooks/use-message-editor";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCanEdit } from "@/hooks/use-can-edit";
import { Replicache } from "replicache";
import { roomMutators } from "@repo/data";
import { nanoid } from "nanoid";

export function MessageEditor({
  rep,
}: {
  rep?: Replicache<typeof roomMutators>;
}) {
  const editor = useMessageEditor({});
  const { user } = useCurrentUser();
  const { workspaceId } = useCurrentWorkspace();

  const { channelId, teamId } = useParams<{
    channelId: string;
    teamId: string;
  }>();

  const canEdit = useCanEdit({
    type: "room",
  });

  async function onSubmit() {
    if (editor) {
      if (editor.isEmpty) return;

      const content = editor.getHTML();
      if (!content || !user) return;

      await rep?.mutate.sendMessage({
        sender: user.id,
        content: content,
        date: new Date().toISOString(),
        id: nanoid(),
        type: "text",
        reactions: [],
      });

      editor.commands.clearContent();
    }
  }

  return (
    <div className=" flex shrink-0 items-end border-t border-border/50 bg-dim px-3.5 py-3">
      {!canEdit && (
        <p className="text-muted-foreground">
          Your are not allowed to send messages in this room.
        </p>
      )}
      {canEdit && (
        <>
          <UploadButton
            workspaceId={workspaceId}
            channelId={channelId}
            teamId={teamId}
            rep={rep}
          />

          <div
            className="flex h-full w-full items-center overflow-hidden"
            onKeyDown={(e) => {
              if (e.code === "Enter" && !e.shiftKey && !e.ctrlKey) {
                onSubmit();
              }
            }}
          >
            <OfflineEditor editor={editor} />
          </div>
          <SidebarItemBtn
            Icon={Send}
            className="ml-2"
            onClick={onSubmit}
            disabled={editor?.isEmpty}
          />
        </>
      )}
    </div>
  );
}
