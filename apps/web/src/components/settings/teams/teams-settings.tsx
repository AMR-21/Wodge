import { Mutable } from "@/lib/utils";
import * as React from "react";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import { SettingsContentHeader, SettingsContentSection } from "../settings";
import { teamColumns } from "./teams-columns";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Team, TeamSchema, WORKSPACE_TEAM_ID_LENGTH } from "@repo/data";
import { nanoid } from "nanoid";
import { ComboboxCell, Separator, SettingsDataTable } from "@repo/ui";

export function TeamsSettings() {
  const { structure, members } = useCurrentWorkspace();
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      name: "",
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
    },
  });

  if (!structure || !members) return null;

  async function onSubmit(data: Team) {
    console.log(data);
    form.setValue("id", nanoid(WORKSPACE_TEAM_ID_LENGTH));
    form.reset();
    setSubmitted(true);
  }

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Teams"
        description="Manage your workspace's teams"
      />

      <SettingsContentSection header="Teams">
        <SettingsDataTable
          columns={teamColumns(members.members)}
          data={
            [
              ...structure.teams,
              {
                id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
                name: "Andriod",
                moderators: ["O1BdzI5H8tdsDOXELi_Sj"],
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
              },
              // {
              //   id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
              //   name: "Apple",
              //   moderators: [],
              //   tags: [],
              // },

              {
                id: "add-team",
                name: "",
                avatar: "",
                moderators: [],
                tags: [],
              },
            ] as Mutable<typeof structure.teams>
          }
          label="team"
          withForm
        />
      </SettingsContentSection>
    </div>
  );
}
