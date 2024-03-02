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
import { useCurrentWorkspace } from "@/components/workspace/workspace-provider";
import { SidebarItemBtn } from "@/components/workspace/sidebar-item-btn";
import { Check, Copy, Repeat } from "lucide-react";
import { useEffect, useState } from "react";
import { NewInviteForm } from "./new-invite-form";
import { MembersTable } from "./members-table";

export function MembersSettings() {
  const { members, metadata } = useCurrentWorkspace();
  const [checked, setChecked] = useState<boolean>(!!!metadata?.inviteLink);
  const [link, setLink] = useState<string | undefined>(metadata?.inviteLink);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setChecked(metadata?.inviteLink ? true : false);
    setLink(metadata?.inviteLink!);
  }, [metadata?.inviteLink]);

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
            <code className="truncate text-xs">
              {link ? (
                "/" + link?.split("/").slice(4).join("/")
              ) : (
                <Skeleton className="h-2 w-full" />
              )}
            </code>

            <div className="flex shrink-0 grow items-center justify-end gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <SidebarItemBtn Icon={Repeat} />
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <NewInviteForm setLink={setLink} />
                </PopoverContent>
                {/* <PopoverC */}
              </Popover>
              <SidebarItemBtn
                Icon={copied ? Check : Copy}
                disabled={copied}
                onClick={() => {
                  navigator.clipboard.writeText(link || "");
                  toast.success("Invite link copied to clipboard");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
              />
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
