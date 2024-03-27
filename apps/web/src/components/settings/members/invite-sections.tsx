import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import { env } from "@repo/env";
import { useState } from "react";
import { Check, Copy, Repeat } from "lucide-react";
import { NewInviteForm } from "./new-invite-form";
import { Invite } from "@repo/data";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { toast } from "@repo/ui/components/ui/toast";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useInvites } from "./use-invites";
import { TooltipWrapper } from "@repo/ui/components/tooltip-wrapper";

function makeLink(token: string, wid: string) {
  return `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${wid}/join?token=${token}`;
}

export function InviteLink() {
  const { inviteLink, isPending } = useInvites();

  const { workspaceId } = useCurrentWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!workspaceId) return null;

  return (
    <pre className="flex w-full items-center justify-between gap-6 overflow-hidden rounded-md bg-accent p-3">
      <code className=" truncate text-sm">
        {isPending ? (
          <Skeleton className="h-4 w-11/12 max-w-lg" />
        ) : inviteLink?.token ? (
          <div className="flex">
            <p className="truncate">{`${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace`}</p>
            <p>{`${inviteLink.token}/join`}</p>
          </div>
        ) : (
          <p>No invite link</p>
        )}
      </code>

      <div className="flex shrink-0 items-center justify-end gap-1">
        <TooltipWrapper content="Remaining invite uses">
          <div className="flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-md border border-primary/50 bg-background text-xs">
            {inviteLink?.limit}
          </div>
        </TooltipWrapper>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <TooltipWrapper content="Regenerate invite link">
            <PopoverTrigger asChild>
              <SidebarItemBtn Icon={Repeat} />
            </PopoverTrigger>
          </TooltipWrapper>
          <PopoverContent>
            <NewInviteForm setIsOpen={setIsOpen} />
          </PopoverContent>
        </Popover>
        {inviteLink?.token && (
          <TooltipWrapper content="Copy invite link">
            <SidebarItemBtn
              Icon={copied ? Check : Copy}
              disabled={copied}
              onClick={() => {
                navigator.clipboard.writeText(
                  makeLink(inviteLink.token, workspaceId) || "",
                );
                toast.success("Invite link copied to clipboard");
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              }}
            />
          </TooltipWrapper>
        )}
      </div>
    </pre>
  );
}
