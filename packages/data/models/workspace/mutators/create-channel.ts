import { produce } from "immer";
import { DrObj } from "../../..";
import {
  Channel,
  ChannelSchema,
  WorkspaceStructure,
} from "../../../schemas/workspace.schema";

interface CreateTeamArgs {
  channel: Channel;
  teamId: string;
  folderId: string;
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
}

export function createChannelMutation({
  channel,
  folderId,
  teamId,
  structure,
}: CreateTeamArgs) {
  //1. Validate the data
  const validateFields = ChannelSchema.pick({
    id: true,
    name: true,
    avatar: true,
    editRoles: true,
    viewRoles: true,
    type: true,
  }).safeParse(channel);

  if (!validateFields.success) throw new Error("Invalid channel data");

  const { data: newChannelBase } = validateFields;
  const newChannel: Channel = { ...newChannelBase };

  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    const der = team?.folders.find((f) => f.id === folderId);
    der?.channels.push(newChannel);
  });
  return newStructure;
}
