import { SafeAvatar } from "@/components/safe-avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SidebarItemBtn } from "./sidebar-item-btn";
import { LogOut, Mic, MicOff, Settings } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { isSidebarOpenAtom } from "@/store/global-atoms";
import { useAtom, useAtomValue } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  isSpeakingAtom,
  micStatusAtom,
  roomAtom,
} from "../room/[teamId]/[channelId]/atoms";

export function UserCard() {
  const { user } = useCurrentUser();

  const isSidebarOpen = useAtomValue(isSidebarOpenAtom);

  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

  const isSpeaking = useAtomValue(isSpeakingAtom);

  const router = useRouter();

  const [micStatus, setMicStatus] = useAtom(micStatusAtom);
  const room = useAtomValue(roomAtom);

  return (
    <div
      className={cn(
        "flex max-h-12 min-h-7 w-60 items-center overflow-hidden  border-r  border-t border-border/50 bg-background px-2 py-2 transition-all",
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
            <SafeAvatar
              src={user?.avatar}
              className={cn(
                "h-8 w-8",
                isSpeaking && "ring-green-500 dark:ring-green-600",
              )}
            />
            <div>
              <p className="text-sm">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground">@{user?.username}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
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

      <TooltipWrapper
        content={micStatus ? "Turn Off Microphone" : "Turn On Microphone"}
      >
        <SidebarItemBtn
          Icon={micStatus ? Mic : MicOff}
          className={cn(
            "ml-auto ",
            !micStatus && "text-destructive hover:text-destructive",
          )}
          onClick={() => {
            if (room)
              room.room.localParticipant.setMicrophoneEnabled(!micStatus);
            setMicStatus(!micStatus);
          }}
          iconClassName="h-5 w-5"
        />
      </TooltipWrapper>
      <TooltipWrapper content="User Settings">
        <SidebarItemBtn
          Icon={Settings}
          className=" "
          iconClassName="h-5 w-5"
          href={
            workspaceSlug ? `/${workspaceSlug}/settings/account` : "/settings"
          }
        />
      </TooltipWrapper>
    </div>
  );
}
