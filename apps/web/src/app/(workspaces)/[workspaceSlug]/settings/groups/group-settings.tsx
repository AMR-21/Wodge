"use client";

import * as React from "react";
import { SettingsContentHeader, SettingsContentSection } from "../settings";
import { DrObj, Group } from "@repo/data";

import { GroupMembersSettings } from "./group-members-settings";
import { GroupGeneralForm } from "./group-general-form";

import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useMember } from "@/hooks/use-member";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export function GroupSettings({
  group,
  isAddition = false,
}: {
  group?: DrObj<Group>;
  isAddition?: boolean;
}) {
  const { workspaceRep } = useCurrentWorkspace();

  const { member } = useMember(group?.createdBy || "");

  async function deleteGroup() {
    if (!group) return;
    try {
      await workspaceRep?.mutate.deleteGroup(group.id);
      toast.success("Group deleted");
    } catch {
      toast.error("Failed to delete group");
    }
  }

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label={`${isAddition ? "Add a new group" : group?.name + " settings"}`}
        description={`${isAddition ? "Create a new group" : "Manage group settings"}`}
        {...(!isAddition && { footer: `Created by ${member?.email}` })}
      />

      <SettingsContentSection header="general">
        <GroupGeneralForm group={group} />
      </SettingsContentSection>

      {!isAddition && (
        <>
          <SettingsContentSection header="manage members">
            <GroupMembersSettings group={group} />
          </SettingsContentSection>

          <SettingsContentSection header="Danger Zone">
            <Button size="sm" variant="destructive" onClick={deleteGroup}>
              Delete Group
            </Button>
          </SettingsContentSection>
        </>
      )}
    </div>
  );
}
