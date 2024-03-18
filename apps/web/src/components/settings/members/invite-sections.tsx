import { SidebarItemBtn } from "@repo/ui/components/sidebar-item-btn";
import { env } from "@repo/env";
import { useState } from "react";
import { Check, Copy, Repeat } from "lucide-react";
import { NewInviteForm } from "./new-invite-form";
import { useCurrentWorkspaceId } from "@repo/ui/hooks/use-current-workspace-id";
import { Invite } from "@repo/data";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { toast } from "@repo/ui/components/ui/toast";

function makeLink(token: string, wid: string) {
  return `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${wid}/join?token=${token}`;
}

export function InviteLink({
  inviteLink,
  isPending,
}: {
  inviteLink: Invite | undefined;
  isPending: boolean;
}) {
  const workspaceId = useCurrentWorkspaceId();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <pre className="flex items-center justify-between overflow-hidden rounded-md bg-surface p-3">
      <code className="w-full truncate text-xs">
        {isPending ? (
          <Skeleton className="h-4 w-11/12 max-w-lg" />
        ) : inviteLink?.token ? (
          <p>{`/workspace/${workspaceId}/join?token=${inviteLink.token}`}</p>
        ) : (
          <p>No invite link</p>
        )}
      </code>

      <div className="flex shrink-0 grow items-center justify-end gap-1">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div>
              <SidebarItemBtn Icon={Repeat} />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <NewInviteForm setIsOpen={setIsOpen} />
          </PopoverContent>
        </Popover>
        {inviteLink?.token && (
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
        )}
      </div>
    </pre>
  );
}
