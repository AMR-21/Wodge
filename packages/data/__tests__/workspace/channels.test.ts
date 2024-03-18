// import test from "node:test";
import { describe, expect, test } from "vitest";
import {
  createTestChannel,
  createTestStructure,
  createTestTeam,
} from "../utils";
import { createChannelMutation } from "../../models/workspace/mutators/create-channel";
import { nanoid } from "nanoid";
import { WORKSPACE_TEAM_ID_LENGTH } from "../..";
import { updateChannelInfoMutation } from "../../models/workspace/mutators/channel-info";

describe("Workspace channels' unit mutations", () => {
  test("Create a channel", async () => {
    // Create starters
    const folderId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team = createTestTeam({
      folders: [
        {
          name: "TEST",
          id: folderId,
          channels: [],
          editRoles: [],
          viewRoles: [],
        },
      ],
    });
    const structure = createTestStructure({ teams: [team] });
    const channel1 = createTestChannel();

    //Test valid channel
    const chn1 = createChannelMutation({
      channel: channel1,
      folderId,
      teamId: team.id,
      structure,
    });
    expect(
      chn1.teams
        .find((t) => t.id === team.id)
        ?.folders.find((f) => f.id === folderId)?.channels
    ).toContainEqual(channel1);

    // Test invalid
    const channel2 = createTestChannel({ name: "" });
    expect(() =>
      createChannelMutation({
        channel: channel2,
        folderId,
        teamId: team.id,
        structure,
      })
    ).toThrowError(/^Invalid channel data$/);

    // Test team non existent
    expect(() =>
      createChannelMutation({
        channel: channel1,
        folderId,
        teamId: nanoid(WORKSPACE_TEAM_ID_LENGTH),
        structure,
      })
    ).toThrowError(/^Team not found$/);

    // Test folder non existent
    expect(() =>
      createChannelMutation({
        channel: channel1,
        folderId: nanoid(WORKSPACE_TEAM_ID_LENGTH),
        teamId: team.id,
        structure,
      })
    ).toThrowError(/^Folder not found$/);

    // Test channel already existed
    const channel3 = createTestChannel();
    const channel4 = createTestChannel({ id: channel3.id });
    const chn3 = createChannelMutation({
      channel: channel3,
      folderId,
      teamId: team.id,
      structure,
    });
    expect(() =>
      createChannelMutation({
        channel: channel4,
        folderId,
        teamId: team.id,
        structure: chn3,
      })
    ).toThrowError(/^Channel already exists$/);
  });

  test("update a team", async () => {
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const folderId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const channelId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const channel = createTestChannel({ id: channelId, name: "Test" });
    const team = createTestTeam({
      id: teamId,
      folders: [
        {
          id: folderId,
          name: "fold test",
          channels: [channel],
          editRoles: [],
          viewRoles: [],
        },
      ],
    });
    const structure = createTestStructure({ teams: [team] });

    const s1 = updateChannelInfoMutation({
      structure,
      update: { name: "New Name" },
      channelId: channel.id,
      folderId,
      teamId,
    });

    expect(
      s1.teams
        .find((t) => t.id === team.id)
        ?.folders.find((f) => f.id === folderId)?.channels
    ).toEqual([{ ...channel, name: "New Name" }]);
  });
});
