import { Settings } from "lucide-react";
import { useContext } from "react";
import {
  SettingsContentHeader,
  SettingsContentSection,
  SettingsContext,
} from "../settings";
import { DrObj, Member, Team, TeamSchema } from "@repo/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DataTable, Form, Input } from "@repo/ui";
import { TeamGeneralForm } from "./team-general-form";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import { MembersTable } from "../members-table";
import { MembersCombobox } from "../members-combobox";
import { useTable } from "../use-table";
import { Mutable } from "@/lib/utils";
import { membersColumns } from "../members-columns";

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

  // To do filter members by team
  const { members } = useCurrentWorkspace();

  const { table } = useTable({
    data: members.members as Mutable<DrObj<Member>[]>,
    columns: membersColumns({
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
            <MembersTable
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
