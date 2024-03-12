import { UserId } from "../../tests";
import { createTestStructure, createTestTeam } from "../utils";
import { createTeamMutation } from "../../models/workspace/mutators/create-team";
import { describe, expect, test } from "vitest";
import { nanoid } from "nanoid";
import { WORKSPACE_TEAM_ID_LENGTH } from "../..";
import { updateTeamInfoMutation } from "../../models/workspace/mutators/team-info";
import {
  addTeamMembersMutation,
  removeTeamMembers,
} from "../../models/workspace/mutators/team-members";
import {
  addTeamDirsMutation,
  deleteTeamDirsMutation,
} from "../../models/workspace/mutators/team-dirs";
import exp from "constants";
import { deleteTeamMutation } from "../../models/workspace/mutators/delete-team";

describe("Workspace teams' unit mutations", () => {
  test("create a team", async () => {
    const structure = createTestStructure();

    // TEST: Create a valid team
    const team1 = createTestTeam();

    expect(
      createTeamMutation({ team: team1, structure, currentUserId: UserId })
        .teams
    ).toContainEqual(team1);

    // TEST: Create a team with invalid data
    const team2 = createTestTeam({ name: "" });

    expect(() =>
      createTeamMutation({ team: team2, structure, currentUserId: UserId })
    ).toThrowError(/^Invalid team data$/);

    const team3 = createTestTeam({ createdBy: "" });

    expect(() =>
      createTeamMutation({ team: team3, structure, currentUserId: UserId })
    ).toThrowError(/^Invalid team data$/);

    // Test: Create a team with invalid owner
    const team4 = createTestTeam({ createdBy: "-4oxKtIB8FXvYZL0AXjXp" });

    expect(() =>
      createTeamMutation({ team: team4, structure, currentUserId: UserId })
    ).toThrowError(/^Unauthorized team creation$/);

    // Test: Create a team that already exists
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team5 = createTestTeam({ id: teamId });

    const newStructure = createTeamMutation({
      team: team5,
      structure,
      currentUserId: UserId,
    });

    expect(() =>
      createTeamMutation({
        team: team5,
        structure: newStructure,
        currentUserId: UserId,
      })
    ).toThrowError(/^Team already exists$/);

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
      createTeamMutation({ team: team6, structure, currentUserId: UserId })
        .teams
    ).toContainEqual({
      ...team6,
      members: [],
      tags: [],
    });
  });

  test("update a team", () => {
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team = createTestTeam({ id: teamId });
    const structure = createTeamMutation({
      team,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: Basic team update
    const s1 = updateTeamInfoMutation({
      structure,
      teamId,
      update: { name: "New Name" },
    });

    expect(s1).toEqual({
      ...structure,
      teams: [{ ...team, name: "New Name" }],
    });

    // Test: update a team with invalid data
    expect(() =>
      updateTeamInfoMutation({
        structure,
        teamId,
        update: { name: "" },
      })
    ).toThrowError(/^Invalid team update data$/);
  });

  test("update team members", () => {
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team = createTestTeam({ id: teamId });
    const structure = createTeamMutation({
      team,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    const curMembers = [
      "-4oxKtIB8FXvYZL0AXjXp",
      "-2oxKtIB8FXvYZL0AXjXp",
      "-3oxKtIB8FXvYZL0AXjXp",
    ];

    // Test: update team members
    expect(
      addTeamMembersMutation({
        structure,
        teamId,
        update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
        curMembers,
      })
    ).toEqual({
      ...structure,
      teams: [{ ...team, members: ["-4oxKtIB8FXvYZL0AXjXp"] }],
    });

    const s2 = addTeamMembersMutation({
      structure,
      teamId,
      update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
      curMembers,
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
      addTeamMembersMutation({
        structure,
        teamId,
        //@ts-ignore
        update: { members: "", created_by: "" },
        curMembers,
      })
    ).toThrowError(/^Invalid team update data$/);

    // non existence team
    expect(() =>
      addTeamMembersMutation({
        structure,
        teamId: "non existing id",
        update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
        curMembers,
      })
    ).toThrowError(/^Team does not exist$/);

    expect(() =>
      addTeamMembersMutation({
        structure,
        teamId,
        update: { members: ["-9oxKtIB8FXvYZL0AXjXp"] },
        curMembers,
      })
    ).toThrowError(/^Invalid members$/);
  });

  test("update team dirs", () => {
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team = createTestTeam({ id: teamId });
    const structure = createTeamMutation({
      team,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: update team dirs
    const dirId = nanoid(WORKSPACE_TEAM_ID_LENGTH);

    expect(
      addTeamDirsMutation({
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
      addTeamDirsMutation({
        structure,
        teamId,
        //@ts-ignore
        update: { dirs: [{ name: "" }] },
      })
    ).toThrowError(/^Invalid team update data$/);

    const s2 = addTeamDirsMutation({
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
    });

    // non existence team
    expect(() =>
      addTeamDirsMutation({
        structure: s2,
        teamId: nanoid(WORKSPACE_TEAM_ID_LENGTH),
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
    ).toThrowError(/^Team does not exist$/);

    expect(() =>
      addTeamDirsMutation({
        structure: s2,
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
    ).toThrowError(/^Dir already exists in team$/);

    expect(
      deleteTeamDirsMutation({
        structure: s2,
        teamId,
        update: { dirs: [dirId] },
      })
    ).toEqual({
      ...s2,
      teams: [{ ...team, dirs: [{ id: "root", name: "root", channels: [] }] }],
    });
  });

  test("delete a team", () => {
    const teamId = nanoid(WORKSPACE_TEAM_ID_LENGTH);
    const team = createTestTeam({ id: teamId });
    const structure = createTeamMutation({
      team,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: delete a team
    expect(
      deleteTeamMutation({
        structure,
        teamId,
      })
    ).toEqual({
      ...structure,
      teams: [],
    });

    // Test: delete a non existing team
    expect(() =>
      deleteTeamMutation({
        structure,
        teamId: "non existing id",
      })
    ).toThrowError(/^Team not found$/);
  });
});
