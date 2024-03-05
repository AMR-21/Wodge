import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Skeleton,
  Switch,
  TooltipWrapper,
  toast,
} from "@repo/ui";
import { SettingsContentHeader, SettingsContentSection } from "../settings";
import { useCurrentWorkspace } from "@/components/workspace/workspace-context";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { Check, Copy, Repeat } from "lucide-react";
import { useState } from "react";
import { NewInviteForm } from "./new-invite-form";
import { MembersTable } from "./members-table";
import { useParams } from "next/navigation";
import { env } from "@repo/env";
import { Invite, Invites } from "@repo/data";
import { useInvites } from "./use-invites";

function getInviteLink(invites?: Invites) {
  if (!invites) return;
  const invite: [string, Invite] | undefined = Object.entries(invites).find(
    ([k, v]) => v.method === "link",
  );

  if (!invite) return;

  return invite[1];
}

function makeLink(token: string, wid: string) {
  return `${env.NEXT_PUBLIC_BACKEND_DOMAIN}/parties/workspace/${wid}/join?token=${token}`;
}

export function MembersSettings() {
  const { metadata } = useCurrentWorkspace();
  const { workspaceId } = useParams() as { workspaceId: string };
  const [checked, setChecked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const [copied, setCopied] = useState(false);
  const { invites, inviteLink, isPending } = useInvites();

  // Todo render email invites
  return (
    <div>
      <SettingsContentHeader
        label="Members settings"
        description="Manage members in this workspace"
      />

      <SettingsContentSection
        header="Invite Link"
        action={
          <TooltipWrapper
            content={checked ? "Disable link inviting" : "Enable link inviting"}
          >
            <Switch
              defaultChecked={checked}
              onCheckedChange={() => {
                // TODO Disable remote invite link

                setChecked((c) => !c);
              }}
            />
          </TooltipWrapper>
        }
      >
        {
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
        }
      </SettingsContentSection>

      <Separator />

      <SettingsContentSection header="Manage Members">
        <MembersTable />
      </SettingsContentSection>
    </div>
  );
}
