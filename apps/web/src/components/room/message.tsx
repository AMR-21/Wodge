import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { useMember } from "@repo/ui/hooks/use-member";
import { format } from "date-fns";
import { Message as MessageType } from "./message-list";
import { SidebarItemBtn } from "../workspace/sidebar-item-btn";
import { MoreHorizontal } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useEffect, useRef } from "react";

export function Message({
  message,
  listRef,
}: {
  message: MessageType;
  listRef: React.RefObject<HTMLDivElement>;
}) {
  const { member, isMembersPending } = useMember(message.sender);
  const msgRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (listRef.current) {
  //     listRef.current.scrollIntoView({ block: "end" });
  //   }
  // }, []);

  if (isMembersPending) return null;

  return (
    <div
      className="group rounded-md p-1.5 transition-all hover:bg-secondary"
      ref={msgRef}
    >
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
      <Markdown
        remarkPlugins={[remarkGfm]}
        className="prose prose-neutral -mt-1 pl-9 text-sm text-foreground dark:prose-invert "
      >
        {message.content}
      </Markdown>
    </div>
  );
}
