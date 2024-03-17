// import test from "node:test";
import { describe, expect, test } from "vitest";
import {
  createTestChannel,
  createTestStructure,
  createTestTeam,
} from "../utils";
import { createChannelMutation } from "../../models/workspace/mutators/create-channel";
import { string } from "zod";
import { createTeamMutation } from "../../models/workspace/mutators/create-team";
import { UserId } from "../tests";

describe("Workspace channels' unit mutations", () => {
  test("Create a channel", async () => {
    //create starters
    const structure = createTestStructure();
    const team = createTestTeam();
    //Add the team to the structure
    const newStructure = createTeamMutation({
      team: team,
      structure,
      currentUserId: UserId,
    });
    const channel1 = createTestChannel();
    const folderId1 = "root";

    const chn = createChannelMutation({
      channel: channel1,
      folderId: folderId1,
      teamId: team.id,
      structure: newStructure,
    });

    expect(
      chn.teams[0]?.folders.find((f) => f.id === folderId1)?.channels
    ).toContainEqual(channel1);
  });
});
