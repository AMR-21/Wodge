import { cn } from "..";
import { UserAvatar } from "./user-avatar";
import { useUserData } from "../hooks/use-user-data";

export function UserCard({ className }: { className?: string }) {
  const data = useUserData();

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
