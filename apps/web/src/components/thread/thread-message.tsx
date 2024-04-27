import { ThreadMessage as ThreadMessageType } from "@repo/data";
import { useMember } from "@repo/ui/hooks/use-member";
import { ThreadAction } from "./thread-actions";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { format } from "date-fns";
import { SidebarItemBtn } from "../workspace/sidebar-item-btn";
import { MoreHorizontal } from "lucide-react";
import { SafeDiv } from "../safe-div";

export function ThreadMessage({ msg }: { msg: ThreadMessageType }) {
  const { member } = useMember(msg.author);

  if (msg.type === "open" || msg.type === "close")
    return <ThreadAction msg={msg} member={member} />;

  return (
    <div className="z-10 flex w-full flex-col items-start rounded-md border border-border/50 bg-dim  px-2 py-4">
      <div className="flex items-start gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage
            src={member?.avatar}
            alt={member?.displayName || "Workspace Member"}
          />
          <AvatarFallback>{member?.displayName[0] || "W"}</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2">
          <p className="text-sm">{member?.displayName || "Workspace Member"}</p>
          <p className="pt-0.5 text-xs text-muted-foreground">
            {format(msg.date, "yyyy/MM/dd h:mm a")}
          </p>
        </div>

        <SidebarItemBtn
          Icon={MoreHorizontal}
          className="ml-auto transition-all"
        />
      </div>

      <SafeDiv className="BlockEditor pl-9 text-sm" html={msg.content} />
    </div>
  );
}
