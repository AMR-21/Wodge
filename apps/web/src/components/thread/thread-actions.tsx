import { PublicUserType, ThreadMessage } from "@repo/data";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

export function ThreadAction({
  msg,
  member,
}: {
  msg: ThreadMessage;
  member?: PublicUserType;
}) {
  return (
    <div className="z-50 flex items-center gap-3 pl-[0.5625rem] text-sm">
      <CheckCircle2
        className={cn(
          "h-6 w-6 shrink-0 rounded-full border-2 border-background  p-0.5 ",
          msg.type === "open"
            ? "bg-green-600 text-green-50"
            : "bg-purple-600 text-purple-50",
        )}
      />
      <div className="flex gap-1">
        <p>@{member?.username || "workspace_member"}</p>
        <p className="text-muted-foreground">
          {msg.type === "open" ? "opened" : "closed"} the thread
        </p>
        <p className="pt-0.5 text-xs text-muted-foreground">
          {msg.date && format(msg.date, "yyyy/MM/dd h:mm a")}
        </p>
      </div>
    </div>
  );
}
