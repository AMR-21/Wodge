import { produce } from "immer";
import { WorkspaceChannelMutation } from "./types";

export function deleteChannelMutation({
  structure,
  teamId,
  folderId,
  channelId,
}: WorkspaceChannelMutation) {
  const newStructure = produce(structure, (draft) => {
    // Check if the team not existing
    const team = draft.teams.find((t) => t.id === teamId);
    if (!team) throw new Error("Team not found");
    // Check if the folder not existing
    const folder = team.folders.find((f) => f.id === folderId);
    if (!folder) throw new Error("Folder not found");
    // Check if the channel not existing
    const channel = folder.channels.find((c) => c.id === channelId);
    if (!channel) throw new Error("Channel not found");
    // Delete the channel
    folder.channels = folder.channels.filter((c) => c.id !== channelId);
  });

  return newStructure;
}
