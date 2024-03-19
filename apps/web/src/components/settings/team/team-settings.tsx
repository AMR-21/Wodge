import { useContext, useMemo } from "react";
import {
  SettingsContentHeader,
  SettingsContentSection,
  SettingsContext,
} from "../settings";
import { DrObj, Member, Team } from "@repo/data";
import { TeamGeneralForm } from "./team-general-form";
import { GeneralMembersTable } from "../general-members-table";
import { useTable } from "../use-table";
import { Mutable } from "@/lib/utils";

import { Button } from "@repo/ui/components/ui/button";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";
import { teamMembersColumns } from "./team-members-columns";

export function TeamSettings() {
  const { activeItemId } = useContext(SettingsContext);
  const isAddition = activeItemId.startsWith("add-");

  const { structure, members, workspaceRep } = useCurrentWorkspace();

  const { user } = useCurrentUser();

  const teams = useMemo(() => {
    return [
      ...structure.teams,
      {
        id: "add-teams",
        name: "",
        members: [],
        createdBy: user?.id || "",
        folders: [],
        moderators: [],
        tags: [],
        avatar: "",
      },
    ] satisfies DrObj<Team>[];
  }, [structure, members]);

  const team = useMemo(
    () => teams.find((t) => t.id === activeItemId),
    [activeItemId, teams],
  );

  const teamMembers = useMemo(() => {
    return members.members.filter((member) =>
      team?.members.includes(member.id),
    );
  }, [members, structure, team]);

  const nonTeamMembers = useMemo(() => {
    return members.members.filter(
      (member) => !team?.members.includes(member.id),
    );
  }, [members, structure, team]);

  const { table } = useTable({
    data: teamMembers as Mutable<DrObj<Member>[]>,
    columns: teamMembersColumns({
      creatorId: team?.createdBy,
      removeMember,
      moderatorsIds: team?.moderators || [],
      changeTeamMemberRole,
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
    console.log("changeTeamMemberRole", memberId, role);

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

  if (!team) return <p>Placeholder</p>;

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label={`${isAddition ? "Add a new team" : team.name + " settings"}`}
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
