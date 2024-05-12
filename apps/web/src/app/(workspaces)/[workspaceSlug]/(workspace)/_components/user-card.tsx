import { SafeAvatar } from "@/components/safe-avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { Mic, Settings } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAppStore } from "@/store/app-store-provider";
import { isSidebarOpenAtom } from "@/store/global-atoms";
import { useAtomValue } from "jotai";

export function UserCard() {
  const { user } = useCurrentUser();
  const {
    micStatus,
    actions: { toggleMic },
  } = useAppStore((s) => s);

  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);

  return (
    <div
      className={cn(
        "flex w-60 items-center overflow-hidden border-r  border-t  border-border/50 bg-background px-2 py-2.5 transition-all",
        !isSidebarOpen && " w-0 px-0",
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              buttonVariants({
                size: "fit",
                variant: "ghost",
              }),
              "select-none justify-start gap-3 ",
            )}
          >
            <SafeAvatar src={user?.avatar} className="h-8 w-8" />
            <div className="">
              <p className="text-sm">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground">@{user?.username}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent></DropdownMenuContent>
      </DropdownMenu>

      <SidebarItemBtn
        Icon={Mic}
        className={cn(
          "ml-auto ",
          !micStatus && "text-red-600 dark:text-red-500",
        )}
        onClick={toggleMic}
        iconClassName="h-5 w-5"
      />
      <SidebarItemBtn Icon={Settings} className=" " iconClassName="h-5 w-5" />
    </div>
  );
}
