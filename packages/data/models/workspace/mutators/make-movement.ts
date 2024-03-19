import { Draft, produce } from "immer";
import { DrObj } from "../../..";
import { WorkspaceStructure } from "../../../schemas/workspace.schema";

type UniqueIdentifier = string | number;

export type Movement =
  | {
      type: "channel-channel";
      from: {
        teamId: string;
        folderId: string;
        channelId: UniqueIdentifier;
        idx: number;
      };
      to: {
        teamId: string;
        folderId: string;
        idx: number;
      };
    }
  | {
      type: "channel-folder";
      from: {
        teamId: string;
        folderId: string;
        channelId: UniqueIdentifier;
        idx: number;
      };
      to: {
        teamId: string;
        folderId: UniqueIdentifier;
      };
    }
  | {
      type: "folder-team";
      from: {
        teamId: string;
        folderId: UniqueIdentifier;
        idx: number;
      };
      to: {
        teamId: UniqueIdentifier;
      };
    }
  | {
      type: "folder-folder";
      from: {
        teamId: string;
        folderId: UniqueIdentifier;
        idx: number;
      };
      to: {
        teamId: string;
        idx: number;
      };
    }
  | {
      type: "team-team";
      from: {
        teamId: UniqueIdentifier;
        idx: number;
      };
      to: {
        idx: number;
      };
    }
  | {
      type: "channel-team";
      from: {
        teamId: string;
        channelId: UniqueIdentifier;
        folderId: string;
        idx: number;
      };
      to: {
        teamId: UniqueIdentifier;
      };
    };

export interface MovementMutationArgs {
  structure: WorkspaceStructure | DrObj<WorkspaceStructure>;
  movement: Movement;
}

export interface MovementRunnerArgs {
  movement: Movement;
  draft: Draft<WorkspaceStructure | DrObj<WorkspaceStructure>>;
}

function extractTeams({
  teamsIds: [fromTeamId, toTeamId],
  draft,
}: {
  teamsIds: [string, string];
  draft: Draft<WorkspaceStructure | DrObj<WorkspaceStructure>>;
}) {
  const fromTeam = draft.teams.find((t) => t.id === fromTeamId);
  const toTeam =
    fromTeamId === toTeamId
      ? fromTeam
      : draft.teams.find((t) => t.id === toTeamId);

  return { fromTeam, toTeam };
}

function ChannelChannelMove({
  movement: { from, to, type },
  draft,
}: MovementRunnerArgs) {
  if (type !== "channel-channel") return draft;

  const { fromTeam, toTeam } = extractTeams({
    teamsIds: [from.teamId, to.teamId],
    draft,
  });

  if (!fromTeam || !toTeam) throw new Error("Team not found");

  const fromFolder = fromTeam.folders.find((f) => f.id === from.folderId);
  const toFolder =
    from.folderId === to.folderId
      ? fromFolder
      : toTeam.folders.find((f) => f.id === to.folderId);

  if (!fromFolder || !toFolder) throw new Error("Folder not found");

  const [channel] = fromFolder.channels.splice(from.idx, 1);
  if (!channel) throw new Error("Channel not found");

  toFolder.channels.splice(to.idx, 0, channel);

  return draft;
}

function ChannelFolderMove({
  movement: { from, to, type },
  draft,
}: MovementRunnerArgs) {
  if (type !== "channel-folder") return draft;

  const { fromTeam, toTeam } = extractTeams({
    teamsIds: [from.teamId, to.teamId],
    draft,
  });

  if (!fromTeam || !toTeam) throw new Error("Team not found");

  const fromFolder = fromTeam.folders.find((f) => f.id === from.folderId);
  const toFolder =
    from.folderId === to.folderId
      ? fromFolder
      : toTeam.folders.find((f) => f.id === to.folderId);

  if (!fromFolder || !toFolder) throw new Error("Folder not found");

  const [channel] = fromFolder.channels.splice(from.idx, 1);
  if (!channel) throw new Error("Channel not found");

  toFolder.channels.unshift(channel);

  return draft;
}

export function makeMovementMutation({
  movement,
  structure,
}: MovementMutationArgs) {
  const { from, to, type } = movement;

  const newStructure = produce(structure, (draft) => {
    switch (type) {
      case "channel-channel":
        return ChannelChannelMove({ movement, draft });
      case "channel-folder":
        return ChannelFolderMove({ movement, draft });
    }
  });
}
