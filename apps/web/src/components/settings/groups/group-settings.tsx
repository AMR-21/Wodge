import * as React from "react";
import {
  SettingsContentHeader,
  SettingsContentSection,
  SettingsContext,
} from "../settings";
import { BRAND_COLOR, DrObj, Group, Member } from "@repo/data";

import { GroupMembersSettings } from "./group-members-settings";
import { GroupGeneralForm } from "./group-general-form";

import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useMember } from "@repo/ui/hooks/use-member";
import { Button } from "@repo/ui/components/ui/button";
import { toast } from "@repo/ui/components/ui/toast";
import { useIsDesktop } from "@repo/ui/hooks/use-is-desktop";

export function GroupSettings() {
  const { activeItemId, dispatch } = React.useContext(SettingsContext);
  const isAddition = activeItemId.startsWith("add-");
  const { structure, workspaceRep } = useCurrentWorkspace();
  const { user } = useCurrentUser();
  const isDesktop = useIsDesktop();

  const groups = React.useMemo(() => {
    return [
      ...structure.groups,
      {
        id: "add-groups",
        name: "",
        members: [],
        createdBy: user?.id || "",
        color: BRAND_COLOR,
      },
    ] satisfies DrObj<Group>[];
  }, [structure.teams, user]);

  const group = React.useMemo(
    () => groups.find((g) => g.id === activeItemId),
    [activeItemId, groups],
  );

  const { member } = useMember(group?.createdBy || "");

  async function deleteGroup() {
    if (!group) return;
    await workspaceRep?.mutate.deleteGroup(group.id);
    toast.success("Group deleted");
    return dispatch({
      type: "openAccordionItem",
      payload: {
        value: "groups",
        id: groups.at(0)?.id,
        isSidebarOpen: isDesktop,
      },
    });
  }

  if (!group) return null;

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label={`${isAddition ? "Add a new group" : group.name + " settings"}`}
        description={`${isAddition ? "Create a new group" : "Manage group settings"}`}
        footer={`Created by ${member?.email}`}
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
