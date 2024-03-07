import { Mutable } from "@/lib/utils";
import * as React from "react";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import { SettingsContentHeader, SettingsContentSection } from "../settings";
import { teamColumns } from "./teams-columns";
import { DrObj, Team, WORKSPACE_TEAM_ID_LENGTH } from "@repo/data";
import { nanoid } from "nanoid";
import { DataTable } from "@repo/ui";
import { UpdateHandlerProps, useTable } from "../use-table";

const teamsX = [
  {
    id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
    dirs: [],
    name: "Andriod",
    moderators: [],
    tags: [
      {
        name: "Mobile",
        color: "#FF0000",
      },
      {
        name: "Google",
        color: "#00FF00",
      },
    ],
    members: [],
  },
];

export function TeamsSettings() {
  const { structure, members, workspace } = useCurrentWorkspace();

  const columns = React.useMemo(() => teamColumns(members.members), [members]);
  const teams = React.useMemo(() => {
    return [
      ...structure.teams,

      {
        id: "add",
        dirs: [],
        name: "",
        moderators: [],
        tags: [],
        members: [],
      },
    ];
  }, [structure]);

  const { table, setEdited, setBuffer } = useTable({
    data: teams as Mutable<typeof structure.teams>,
    columns: columns,
    updateHandler: onUpdate,
    withForm: true,
  });

  async function onUpdate({ data, idx }: UpdateHandlerProps<DrObj<Team>>) {
    console.log("onUpdate", data, idx);

    const affectedTeam = teams[idx];

    if (!affectedTeam) return;

    if (!structure.teams.some((t) => t.id === affectedTeam.id)) {
      await workspace?.store.mutate.createTeam({
        ...affectedTeam,
        ...data,
        id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      });

      // Remain in the current page
    }

    table.options.meta?.discard(idx);
  }

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Teams"
        description="Manage your workspace's teams"
      />

      <SettingsContentSection header="Teams">
        <DataTable table={table} label="team" withForm />
      </SettingsContentSection>
    </div>
  );
}
