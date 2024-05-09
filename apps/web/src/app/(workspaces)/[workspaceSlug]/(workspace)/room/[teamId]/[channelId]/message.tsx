import { useMember } from "@repo/ui/hooks/use-member";
import { differenceInMinutes, format, sub } from "date-fns";
import { DrObj, Message as MessageType } from "@repo/data";
import { MoreHorizontal } from "lucide-react";
import React, { memo, useRef, useState } from "react";
import { SafeAvatar } from "@repo/ui/components/safe-avatar";
import { SafeDiv } from "@/components/safe-div";
import { SidebarItemBtn } from "@repo/ui/components/data-table/sidebar-item-btn";
import { ImageMessage } from "./image-message";
import { AudioMessage } from "./audio-message";
import { FileMessage } from "./file-message";
import { VideoMessage } from "./video-message";

export const Message = memo(
  ({
    message,
    workspaceId,
    prevMsg,
  }: {
    message: MessageType | DrObj<MessageType>;
    workspaceId: string;
    prevMsg?: MessageType | DrObj<MessageType>;
  }) => {
    const { member, isMembersPending } = useMember(message.sender);

    if (isMembersPending) return null;

    const isHeaderHideable =
      !!prevMsg &&
      prevMsg.sender === message.sender &&
      differenceInMinutes(message.date, prevMsg.date) < 5;

    if (isHeaderHideable) {
      return (
        <div className="group relative flex break-words rounded-md px-1.5 py-0.5 transition-all hover:bg-secondary">
          <p className="invisible absolute left-1 top-1/2 -translate-y-1/2 text-xs text-muted-foreground transition-all group-hover:visible">
            {format(message.date, "HH:mm")}
          </p>
          <div className="pl-9">
            {message.type === "text" && (
              <SafeDiv
                className="MessageEditor text-sm"
                html={message.content}
              />
            )}
            {message.type === "image" && (
              <ImageMessage message={message} workspaceId={workspaceId} />
            )}
            {message.type === "audio" && (
              <AudioMessage message={message} workspaceId={workspaceId} />
            )}
            {message.type === "file" && (
              <FileMessage message={message} workspaceId={workspaceId} />
            )}
            {message.type === "video" && (
              <VideoMessage message={message} workspaceId={workspaceId} />
            )}
          </div>

          <SidebarItemBtn
            Icon={MoreHorizontal}
            className="invisible ml-auto transition-all group-hover:visible"
          />
        </div>
      );
    }

    return (
      <div className="group break-words rounded-md p-1.5 transition-all hover:bg-secondary">
        <div className="flex items-start gap-2">
          {!isHeaderHideable && (
            <SafeAvatar
              className="h-7 w-7"
              src={member?.avatar}
              fallback={member?.displayName}
            />
          )}

          <div className="flex items-center gap-2">
            {!isHeaderHideable && (
              <p className="text-sm">{member?.displayName}</p>
            )}
            <p className="pt-0.5 text-xs text-muted-foreground">
              {format(message.date, "yyyy/MM/dd HH:mm")}
            </p>
          </div>

          <SidebarItemBtn
            Icon={MoreHorizontal}
            className="invisible ml-auto transition-all group-hover:visible"
          />
        </div>

        <div className="pl-9">
          {message.type === "image" && (
            <ImageMessage message={message} workspaceId={workspaceId} />
          )}
          {message.type === "text" && (
            <SafeDiv className="MessageEditor text-sm" html={message.content} />
          )}
          {message.type === "audio" && (
            <AudioMessage message={message} workspaceId={workspaceId} />
          )}
          {message.type === "file" && (
            <FileMessage message={message} workspaceId={workspaceId} />
          )}
          {message.type === "video" && (
            <VideoMessage message={message} workspaceId={workspaceId} />
          )}
        </div>
      </div>
    );
  },
);
