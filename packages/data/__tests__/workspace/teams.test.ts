import { UserId } from "../../tests";
import { createTestStructure, createTestTeam } from "../utils";
import { createTeam } from "../../models/workspace/mutators/create-team";
import { describe, expect, test } from "vitest";
import { nanoid } from "nanoid";
import { WORKSPACE_TEAM_ID_LENGTH } from "../..";
import { updateTeamInfo } from "../../models/workspace/mutators/team-info";
import {
  addTeamMembers,
  removeTeamMembers,
} from "../../models/workspace/mutators/team-members";
import { addTeamDirs } from "../../models/workspace/mutators/team-dirs";

describe("Workspace teams' unit mutations", () => {
  test("create a team", async () => {
    const structure = createTestStructure();

    // TEST: Create a valid team
    const team1 = createTestTeam();

    expect(
      createTeam({ team: team1, structure, currentUserId: UserId }).teams
    ).toContainEqual(team1);

    // TEST: Create a team with invalid data
    const team2 = createTestTeam({ name: "" });

    expect(() =>
      createTeam({ team: team2, structure, currentUserId: UserId })
    ).toThrowError("Invalid team data");

    const team3 = createTestTeam({ createdBy: "" });

    expect(() =>
      createTeam({ team: team3, structure, currentUserId: UserId })
    ).toThrowError("Invalid team data");

    // Test: Create a team with invalid owner
    const team4 = createTestTeam({ createdBy: "-4oxKtIB8FXvYZL0AXjXp" });

    expect(() =>
      createTeam({ team: team4, structure, currentUserId: UserId })
    ).toThrowError("Unauthorized team creation");

    // Test: Create a team that already exists
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team5 = createTestTeam({ id: teamId });

    const newStructure = createTeam({
      team: team5,
      structure,
      currentUserId: UserId,
    });

    expect(() =>
      createTeam({
        team: team5,
        structure: newStructure,
        currentUserId: UserId,
      })
    ).toThrowError("Team already exists");

    // Test: Team creation sanitization
    const team6 = createTestTeam({
      members: ["-4oxKtIB8FXvYZL0AXjXp"],
      tags: [
        {
          name: "test",
          color: "#000000",
        },
      ],
    });

    expect(
      createTeam({ team: team6, structure, currentUserId: UserId }).teams
    ).toContainEqual({
      ...team6,
      members: [],
      tags: [],
    });
  });

  test("update a team", () => {
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team = createTestTeam({ id: teamId });
    const structure = createTeam({
      team,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: Basic team update
    const s1 = updateTeamInfo({
      structure,
      teamId,
      update: { name: "New Name" },
    });

    expect(s1).toEqual({
      ...structure,
      teams: [{ ...team, name: "New Name" }],
    });

    // update a team with invalid data
    expect(() =>
      updateTeamInfo({
        structure,
        teamId,
        update: { name: "" },
      })
    ).toThrowError("Invalid team update data");
  });

  test("update team members", () => {
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team = createTestTeam({ id: teamId });
    const structure = createTeam({
      team,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: update team members
    expect(
      addTeamMembers({
        structure,
        teamId,
        update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
      })
    ).toEqual({
      ...structure,
      teams: [{ ...team, members: ["-4oxKtIB8FXvYZL0AXjXp"] }],
    });

    const s2 = addTeamMembers({
      structure,
      teamId,
      update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
    });

    expect(
      removeTeamMembers({
        structure: s2,
        teamId,
        update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
      })
    ).toEqual({
      ...structure,
      teams: [{ ...team, members: [] }],
    });

    // Test: update team members with invalid data
    expect(() =>
      addTeamMembers({
        structure,
        teamId,
        //@ts-ignore
        update: { members: [""], createdBy: "" },
      })
    ).toThrowError("Invalid team update data");
  });

  test("update team dirs", () => {
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team = createTestTeam({ id: teamId });
    const structure = createTeam({
      team,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: update team dirs
    const dirId = nanoid(WORKSPACE_TEAM_ID_LENGTH);

    expect(
      addTeamDirs({
        structure,
        teamId,
        update: {
          dirs: [
            {
              name: "Account",
              id: dirId,
              channels: [],
            },
          ],
        },
      })
    ).toEqual({
      ...structure,
      teams: [
        {
          ...team,
          dirs: [
            ...team.dirs,
            {
              name: "Account",
              id: dirId,
              channels: [],
            },
          ],
        },
      ],
    });

    // Test: update team dirs with invalid data
    expect(() =>
      addTeamDirs({
        structure,
        teamId,
        //@ts-ignore
        update: { dirs: [{ name: "" }] },
      })
    ).toThrowError("Invalid team update data");
  });
});
