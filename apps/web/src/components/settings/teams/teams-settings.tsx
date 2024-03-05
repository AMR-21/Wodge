import { Mutable } from "@/lib/utils";
import { useCurrentWorkspace } from "../../workspace/workspace-context";
import {
  SettingsContentDescription,
  SettingsContentHeader,
  SettingsContentSection,
} from "../settings";
import { columns } from "./teams-columns";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DataTable,
  Separator,
} from "@repo/ui";

export function TeamsSettings() {
  const { structure } = useCurrentWorkspace();

  if (!structure) return null;

  console.log(structure.teams);

  return (
    <div className="">
      <SettingsContentHeader
        label="Teams"
        description="Manage your workspace's teams"
      />

      <SettingsContentSection header="Add a team">a</SettingsContentSection>

      <Separator />

      <SettingsContentSection header="Teams">
        <DataTable
          columns={columns}
          data={structure.teams as Mutable<typeof structure.teams>}
        />
      </SettingsContentSection>
    </div>
  );
}
