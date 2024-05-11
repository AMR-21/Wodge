"use client";

import { useMemo } from "react";
import { SettingsContentHeader, SettingsContentSection } from "../settings";
import { DrObj, Team } from "@repo/data";
import { TeamGeneralForm } from "./team-general-form";
import { GeneralMembersTable } from "../general-members-table";
import { useTable } from "../use-table";

import { Button } from "@/components/ui/button";
import { useCurrentWorkspace } from "@/components/workspace-provider";
import { teamMembersColumns } from "./team-members-columns";

export function TeamSettings({
  team,
  isAddition = false,
}: {
  team?: DrObj<Team>;
  isAddition?: boolean;
}) {
  const { structure, members, workspaceRep, workspaceId } =
    useCurrentWorkspace();

  const nonTeamMembers = useMemo(() => {
    return members.members.filter(
      (member) => !team?.members.includes(member.id),
    );
  }, [members, structure, team]);

  const teamMembers = useMemo(() => team?.members || [], [team]) as string[];

  const { table } = useTable({
    data: teamMembers,
    columns: teamMembersColumns({
      creatorId: team?.createdBy,
      removeMember,
      moderatorsIds: team?.moderators || [],
      changeTeamMemberRole,
      workspaceId,
    }),
  });

  async function addMember(memberId: string) {
    if (!team) return;
    await workspaceRep?.mutate.updateTeam({
      teamId: team.id,
      teamUpdate: {
        action: "addMembers",
        update: {
          members: [memberId],
        },
      },
    });
  }

  async function removeMember(memberId: string) {
    if (!team) return;
    await workspaceRep?.mutate.updateTeam({
      teamId: team.id,
      teamUpdate: {
        action: "removeMembers",
        update: {
          members: [memberId],
        },
      },
    });
  }

  async function changeTeamMemberRole(
    memberId: string,
    role: "teamMember" | "moderator",
  ) {
    if (!team) return;
    await workspaceRep?.mutate.updateTeam({
      teamId: team.id,
      teamUpdate: {
        action: "changeTeamMemberRole",
        update: {
          memberId,
          role,
        },
      },
    });
  }

  async function deleteTeam() {
    if (!team) return;
    await workspaceRep?.mutate.deleteTeam(team.id);
  }

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label={`${isAddition ? "Add a new team" : team?.name + " settings"}`}
        description={`${isAddition ? "Create a new team" : "Manage team settings"}`}
      />

      <SettingsContentSection header="General">
        <TeamGeneralForm team={team} />
      </SettingsContentSection>

      {!isAddition && (
        <>
          <SettingsContentSection header="Manage Members">
            <GeneralMembersTable
              table={table}
              members={nonTeamMembers}
              addMember={addMember}
            />
          </SettingsContentSection>

          <SettingsContentSection header="Manage Tags">
            <p>To do</p>
          </SettingsContentSection>

          <SettingsContentSection header="Danger Zone">
            <Button size="sm" variant="destructive" onClick={deleteTeam}>
              Delete Team
            </Button>
          </SettingsContentSection>
        </>
      )}
    </div>
  );
}
