import { cn, useCurrentUser } from "..";
import { UserAvatar } from "./user-avatar";

export function UserCard({ className }: { className?: string }) {
  const user = useCurrentUser();

  const data = user?.data;

  // TODO add skeleton
  if (!data) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <UserAvatar
        className="h-9 w-9"
        avatar={data.avatar}
        interactive={false}
      />
      <div>
        <p className="text-sm font-medium">{data.displayName}</p>
        <p className="text-xs text-muted-foreground">{data.username}</p>
      </div>
    </div>
  );
}
