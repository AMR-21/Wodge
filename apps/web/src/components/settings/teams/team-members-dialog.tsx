import { Member } from "@repo/data";
import { Button, DataTable, Input } from "@repo/ui";
import { DeepReadonlyObject } from "replicache";
import { teamMembersColumns } from "./teams-members-columns";
import { Mutable } from "@/lib/utils";
import { SettingsContentSection } from "../settings";

interface TeamMembersDialogProps {
  members: readonly DeepReadonlyObject<Member>[];
  teamId: string;
  moderators: readonly string[];
  // addMember: (memberId: string) => void;
  // removeMember: (memberId: string) => void;
  // makeModerator: (memberId: string) => void;
}

export function TeamMembersDialog({
  // addMember,
  // makeModerator,
  // removeMember,
  members,
  moderators,
  teamId,
}: TeamMembersDialogProps) {
  // TODO
  // const teamMembers = members.filter((member) => member.teams.includes(teamId));
  const teamMembers = members;
  return (
    <div className="w-full">
      <SettingsContentSection
        header="Manage team members"
        className="space-y-4 "
      >
        <div className="flex items-center justify-between  gap-4">
          <Input placeholder="Search members by emails " className="max-w-56" />

          <Button size="sm">Add a member</Button>
        </div>
        <DataTable
          columns={teamMembersColumns(moderators)}
          data={teamMembers as Mutable<typeof members>}
        />
      </SettingsContentSection>
    </div>
  );
}
