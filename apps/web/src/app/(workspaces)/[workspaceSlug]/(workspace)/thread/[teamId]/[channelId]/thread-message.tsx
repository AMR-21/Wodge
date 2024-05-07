import { Thread, ThreadMessage as ThreadMessageType } from "@repo/data";
import { useMember } from "@repo/ui/hooks/use-member";
import { ThreadAction } from "./thread-actions";
import { format } from "date-fns";
import { SafeAvatar } from "@repo/ui/components/safe-avatar";

import { ThreadDropDown } from "../../thread-dropdown";
import { SafeDiv } from "@/components/safe-div";
import { useIsTeamModerator } from "@repo/ui/hooks/use-is-team-moderator";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useEditEditor } from "./use-edit-editor";
import { EditEditor } from "../edit-editor";

export function ThreadMessage({
  msg,
  type,
  isResolved,
  onDeleteMsg,
  onEditMsg,
}: {
  msg: ThreadMessageType;
  type: Thread["type"];
  isResolved?: boolean;
  onDeleteMsg?: (msg: ThreadMessageType) => void;
  onEditMsg?: (msg: ThreadMessageType, content: string) => Promise<void>;
}) {
  const { member } = useMember(msg.author);
  const { user } = useCurrentUser();

  const isPrivileged = useIsTeamModerator();

  const { isEditing, setIsEditing, onCancelEdit, onEdit } = useEditEditor();

  if (msg.type === "open" || msg.type === "close")
    return <ThreadAction msg={msg} member={member} />;

  return (
    <div className="group flex flex-col items-start rounded-md border border-border/50 bg-dim px-2 py-4">
      <div className="flex w-full items-start gap-2">
        <SafeAvatar
          src={member?.avatar}
          fallback={member?.displayName[0] || "W"}
          className="h-7 w-7"
        />

        <div className="flex w-full items-center gap-2">
          <p className="text-sm">{member?.displayName || "Workspace Member"}</p>
          <p className="pt-0.5 text-xs text-muted-foreground">
            {format(msg.date, "yyyy/MM/dd h:mm a")}
          </p>
        </div>

        <ThreadDropDown
          label={type === "post" ? "comment" : "answer"}
          onEdit={onEdit}
          onDelete={() => onDeleteMsg?.(msg as ThreadMessageType)}
          canDelete={!isResolved && (msg.author === user?.id || isPrivileged)}
          canEdit={!isResolved && msg.author === user?.id}
        />
      </div>

      {isEditing ? (
        <div className="w-full pl-9">
          <EditEditor
            content={msg}
            onCancelEdit={onCancelEdit}
            onSuccessEdit={async (text: string) => {
              await onEditMsg?.(msg, text);
              setIsEditing(false);
            }}
          />
        </div>
      ) : (
        <SafeDiv className="BlockEditor pl-9" html={msg.content} />
      )}
    </div>
  );
}