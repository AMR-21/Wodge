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
  const validateFields = ChannelSchema.safeParse(channel);

  if (!validateFields.success) throw new Error("Invalid channel data");

  const { data: newChannelBase } = validateFields;
  const newChannel: Channel = { ...newChannelBase };

  const newStructure = produce(structure, (draft) => {
    const team = draft.teams.find((t) => t.id === teamId);
    if (!team) throw new Error("Team not found");
    const fold = team?.folders.find((f) => f.id === folderId);
    if (!fold) throw new Error("Folder not found");
    if (fold.channels.find((ch) => ch.id === newChannel.id)) {
      throw new Error("Channel already exists");
    } else {
      fold?.channels.push(newChannel);
    }
  });
  return newStructure;
}
