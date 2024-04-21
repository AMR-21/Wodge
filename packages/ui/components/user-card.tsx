import { cn, useCurrentUser } from "..";
import { UserAvatar } from "./user-avatar";

export function UserCard({ className }: { className?: string }) {
  const { user } = useCurrentUser();

  // TODO add skeleton
  if (!user) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <UserAvatar
        className="h-9 w-9"
        avatar={user.avatar}
        interactive={false}
      />
      <div>
        <p className="text-sm font-medium">{user.displayName}</p>
        <p className="text-xs text-muted-foreground">{user.username}</p>
      </div>
    </div>
  );
}
