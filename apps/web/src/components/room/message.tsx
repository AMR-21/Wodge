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

export function Message({ message }: { message: MessageType }) {
  const { member, isMembersPending } = useMember(message.sender);
  if (isMembersPending) return null;

  return (
    <div className="group rounded-md p-1.5 transition-all hover:bg-secondary">
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
      <p className="-mt-1 pl-9 text-sm">{message.content}</p>
    </div>
  );
}
