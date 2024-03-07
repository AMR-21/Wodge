import { Mutable } from "@/lib/utils";
import * as React from "react";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import { SettingsContentHeader, SettingsContentSection } from "../settings";
import { teamColumns } from "./teams-columns";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DrObj, Team, TeamSchema, WORKSPACE_TEAM_ID_LENGTH } from "@repo/data";
import { nanoid } from "nanoid";
import {
  ComboboxCell,
  DataTable,
  Separator,
  SettingsDataTable,
} from "@repo/ui";
import { DeepReadonlyObject } from "replicache";
import {
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getCoreRowModel } from "@tanstack/react-table";
import { UpdateHandlerProps, useTable } from "../use-table";
import { produce } from "immer";
import { useImmer } from "use-immer";

export function TeamsSettings() {
  const { structure, members } = useCurrentWorkspace();

  const columns = React.useMemo(
    () => teamColumns(members.members),
    [members.members],
  );

  const teams = React.useMemo(
    () => [
      ...structure.teams,
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
    ],
    [structure.teams],
  );

  const { table } = useTable({
    data: teams as Mutable<typeof structure.teams>,
    columns: columns,
    updateHandler: onUpdate,
  });

  function onUpdate({ data, idx }: UpdateHandlerProps<DrObj<Team>>) {
    console.log("onUpdate", data, idx);
  }

  return (
    <div className="w-full shrink-0 grow divide-y-[1px] divide-border/70">
      <SettingsContentHeader
        label="Teams"
        description="Manage your workspace's teams"
      />

      <SettingsContentSection header="Teams">
        <DataTable table={table} />
      </SettingsContentSection>
    </div>
  );
}
