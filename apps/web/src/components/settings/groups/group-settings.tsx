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

export function GroupSettings() {
  const { activeItemId } = React.useContext(SettingsContext);
  const isAddition = activeItemId.startsWith("add-");
  const { structure } = useCurrentWorkspace();
  const { user } = useCurrentUser();

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
  }, [structure, user]);

  const group = groups.find((g) => g.id === activeItemId);

  const { member } = useMember(group?.createdBy || "");

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

      <SettingsContentSection header="manage members">
        <GroupMembersSettings group={group} />
      </SettingsContentSection>
    </div>
  );
}
