import { useMember } from "@/hooks/use-member";
import { differenceInMinutes, format } from "date-fns";
import { DrObj, Message as MessageType } from "@repo/data";
import React, { memo, useRef } from "react";
import { SafeAvatar } from "@/components/safe-avatar";
import { SafeDiv } from "@/components/safe-div";
import { ImageMessage } from "./image-message";
import { AudioMessage } from "./audio-message";
import { FileMessage } from "./file-message";
import { VideoMessage } from "./video-message";
import { MessageDropDown } from "../../message-dropdown";
import { useCanEdit } from "@/hooks/use-can-edit";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useIsTeamModerator } from "@/hooks/use-is-team-moderator";
import { useEditEditor } from "../../../thread/[teamId]/[channelId]/use-edit-editor";
import { EditEditor } from "./edit-editor";
import { cn } from "@/lib/utils";

export const Message = memo(
  ({
    message,
    workspaceId,
    prevMsg,
    onDelete,
    onSuccessEdit,
  }: {
    message: MessageType | DrObj<MessageType>;
    workspaceId: string;
    prevMsg?: MessageType | DrObj<MessageType>;
    onDelete?: (msg: MessageType) => Promise<void>;
    onSuccessEdit?: (msg: MessageType, newContent: string) => Promise<void>;
  }) => {
    const { member, isMembersPending } = useMember(message.sender);

    const { user } = useCurrentUser();

    const isTeamModerator = useIsTeamModerator();

    const { isEditing, onCancelEdit, onEdit, setIsEditing } = useEditEditor();

    if (isMembersPending) return null;

    const isHeaderHideable =
      !!prevMsg &&
      prevMsg.sender === message.sender &&
      differenceInMinutes(message.date, prevMsg.date) < 5;

    if (isHeaderHideable) {
      return (
        <div className="group relative flex break-words rounded-md px-1.5 py-0.5 transition-all hover:bg-secondary/40">
          <p
            className={cn(
              "invisible absolute left-1 top-1/2 -translate-y-1/2 text-xs text-muted-foreground transition-all group-hover:visible",
              isEditing && "top-0 translate-y-1/2",
            )}
          >
            {format(message.date, "HH:mm")}
          </p>
          <div className="w-full pl-9">
            {isEditing ? (
              <EditEditor
                content={message as MessageType}
                onCancelEdit={() => onCancelEdit()}
                onSuccessEdit={(newContent) => {
                  onSuccessEdit?.(message as MessageType, newContent);
                  setIsEditing(false);
                }}
              />
            ) : (
              <Content m={message} workspaceId={workspaceId} />
            )}
          </div>

          <MessageDropDown
            canEdit={user?.id === message.sender && message.type === "text"}
            canDelete={isTeamModerator || user?.id === message.sender}
            onDelete={() => onDelete?.(message as MessageType)}
            onEdit={() => {
              setIsEditing(true);
            }}
          />
        </div>
      );
    }

    return (
      <div className="group break-words rounded-md p-1.5 transition-all hover:bg-secondary/40">
        <div className="flex items-start gap-2">
          <SafeAvatar
            className="h-7 w-7"
            src={member?.avatar}
            fallback={member?.displayName}
          />

          <div className="flex items-center gap-2">
            <p className="text-sm">{member?.displayName}</p>
            <p className="pt-0.5 text-xs text-muted-foreground">
              {format(message.date, "yyyy/MM/dd HH:mm")}
            </p>
          </div>

          <MessageDropDown
            canEdit={user?.id === message.sender && message.type === "text"}
            canDelete={isTeamModerator || user?.id === message.sender}
            onDelete={() => {
              onDelete?.(message as MessageType);
            }}
            onEdit={() => {
              setIsEditing(true);
            }}
          />
        </div>
        <div className="pl-9">
          {isEditing ? (
            <EditEditor
              content={message as MessageType}
              onCancelEdit={() => onCancelEdit()}
              onSuccessEdit={(newContent) => {
                onSuccessEdit?.(message as MessageType, newContent);
                setIsEditing(false);
              }}
            />
          ) : (
            <Content m={message} workspaceId={workspaceId} />
          )}
        </div>
      </div>
    );
  },
);

function Content({
  m,
  workspaceId,
}: {
  m: DrObj<MessageType>;
  workspaceId: string;
}) {
  return (
    <>
      {m.type === "text" && (
        <SafeDiv className="MessageEditor text-sm" html={m.content} />
      )}
      {m.type === "image" && (
        <ImageMessage message={m} workspaceId={workspaceId} />
      )}
      {m.type === "audio" && (
        <AudioMessage message={m} workspaceId={workspaceId} />
      )}
      {m.type === "file" && (
        <FileMessage message={m} workspaceId={workspaceId} />
      )}
      {m.type === "video" && (
        <VideoMessage message={m} workspaceId={workspaceId} />
      )}
    </>
  );
}
