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
import { generalMembersColumns } from "../general-members-columns";
import { Button } from "@repo/ui/components/ui/button";
import { useCurrentWorkspace } from "@repo/ui/hooks/use-current-workspace";
import { useCurrentUser } from "@repo/ui/hooks/use-current-user";

export function TeamSettings() {
  const { activeItemId } = useContext(SettingsContext);
  const isAddition = activeItemId.startsWith("add-");

  const { structure } = useCurrentWorkspace();

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
  }, [structure.teams, user]);

  const team = useMemo(
    () => teams.find((t) => t.id === activeItemId),
    [activeItemId, teams],
  );

  const { members } = useCurrentWorkspace();

  const teamMembers = members.members.filter((m) =>
    team?.members.includes(m.id),
  );

  const nonTeamMembers = members.members.filter(
    (m) => !team?.members.includes(m.id),
  );

  const { table } = useTable({
    data: teamMembers as Mutable<DrObj<Member>[]>,
    columns: generalMembersColumns({
      creatorId: team?.createdBy,
      removeMember,
    }),
  });

  if (!team) return null;

  function addMember(memberId: string) {
    console.log("add member", memberId);
  }

  function removeMember(memberId: string) {
    console.log("remove member", memberId);
  }

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
            <Button size="sm" variant="destructive">
              Delete Team
            </Button>
          </SettingsContentSection>
        </>
      )}
    </div>
  );
}
