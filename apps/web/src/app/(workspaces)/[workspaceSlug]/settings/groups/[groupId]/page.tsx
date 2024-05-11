"use client";

import { GroupSettings } from "@/app/(workspaces)/[workspaceSlug]/settings/groups/group-settings";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { useMemo } from "react";

function GroupSettingsPage({
  params: { groupId },
}: {
  params: { workspaceSlug: string; groupId: string };
}) {
  const { structure } = useCurrentWorkspace();

  const group = useMemo(
    () => structure.groups.find((g) => g.id === groupId),
    [groupId, structure.groups],
  );

  if (!group) return <p>Team not found</p>;

  return <GroupSettings group={group} />;
}

export default GroupSettingsPage;
