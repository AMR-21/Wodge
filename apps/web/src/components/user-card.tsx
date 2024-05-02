import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { toast } from "@repo/ui/components/ui/toast";
import { UserAvatar } from "@repo/ui/components/user-avatar";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { cn } from "@repo/ui/lib/utils";
import { LogOut, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserCard({ className }: { className?: string }) {
  const { user } = useCurrentUser();
  const router = useRouter();
  // TODO add skeleton
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1 hover:bg-secondary/60 aria-expanded:bg-secondary/60 ",
            className,
          )}
        >
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuItem className="gap-2 text-sm">
          <Settings2 className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-sm"
          onClick={async () => {
            const supabase = createClient();

            const { error } = await supabase.auth.signOut();

            if (error) {
              toast.error("Failed to log out");
            } else {
              router.push("/login");
            }
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
