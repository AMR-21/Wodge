import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { useMember } from "@repo/ui/hooks/use-member";
import { format } from "date-fns";
import { lastSenderIdAtom, Message as MessageType } from "./message-list";
import { SidebarItemBtn } from "../workspace/sidebar-item-btn";
import { MoreHorizontal } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useEffect, useMemo, useRef } from "react";
import { useAtomValue } from "jotai";

export function Message({
  message,
  lastSenderId,
}: {
  message: MessageType;
  lastSenderId?: string;
}) {
  const { member, isMembersPending } = useMember(message.sender);

  if (isMembersPending) return null;

  return (
    <div className="group overflow-hidden break-words rounded-md p-1.5 transition-all hover:bg-secondary">
      {/* {lastSenderId !== member?.id && ( */}
      {true && (
        <>
          <div className="flex items-start gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={member?.avatar} alt={member?.displayName} />
              <AvatarFallback>{member?.displayName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2">
              <p className="text-sm">{member?.displayName}</p>
              <p className="pt-0.5 text-xs text-muted-foreground">
                {format(message.date, "yyyy/MM/dd h:mm a")}
              </p>
            </div>

            <SidebarItemBtn
              Icon={MoreHorizontal}
              className="invisible ml-auto transition-all group-hover:visible"
            />
          </div>
        </>
      )}

      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              className="text-sky-500   dark:text-sky-400"
            />
          ),
        }}
        className="prose prose-neutral -mt-1  overflow-hidden text-clip text-balance pl-9 text-sm text-foreground dark:prose-invert  prose-a:truncate"
      >
        {message.content}
      </Markdown>
    </div>
  );
}
