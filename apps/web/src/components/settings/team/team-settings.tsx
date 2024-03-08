import { useContext } from "react";
import {
  SettingsContentHeader,
  SettingsContentSection,
  SettingsContext,
} from "../settings";
import { DrObj, Member } from "@repo/data";
import { Button } from "@repo/ui";
import { TeamGeneralForm } from "./team-general-form";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import { GeneralMembersTable } from "../general-members-table";
import { useTable } from "../use-table";
import { Mutable } from "@/lib/utils";
import { generalMembersColumns } from "../general-members-columns";

export function TeamSettings() {
  const { activeItemId } = useContext(SettingsContext);
  const isAddition = activeItemId === "add";

  const { structure } = useCurrentWorkspace();

  const teams = [
    ...structure.teams,
    {
      id: "add",
      name: "",
      members: ["kueXSygx5naiwy_5XSRns"],
      tags: [],
      createdBy: "kueXSygx5naiwy_5XSRns",
      dirs: [],
    },
  ];

  const team = teams.find((team) => team.id === activeItemId);

  // Todo filter members by team
  const { members } = useCurrentWorkspace();

  const { table } = useTable({
    data: members.members as Mutable<DrObj<Member>[]>,
    columns: generalMembersColumns({
      creatorId: team?.createdBy,
      removeMember,
    }),
  });

  if (!team) return null;

  function addMember(member: Member) {
    console.log("add member", member);
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
              members={members.members}
              addMember={addMember}
            />
          </SettingsContentSection>

          <SettingsContentSection header="Manage Tags">
            <p>To do</p>
          </SettingsContentSection>

          <SettingsContentSection header="Danger Zone">
            <Button size="sm" variant="destructive">
              Delete Workspace
            </Button>
          </SettingsContentSection>
        </>
      )}
    </div>
  );
}
