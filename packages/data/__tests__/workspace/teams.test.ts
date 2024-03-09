import { ReadTransaction, Replicache, TEST_LICENSE_KEY } from "replicache";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import {
  TeamUpdate,
  workspaceMutators,
} from "../../models/workspace/workspace-mutators";
import { nanoid } from "nanoid";
import { ID_LENGTH, WORKSPACE_TEAM_ID_LENGTH } from "../../schemas/config";
import { UserId } from "../../tests";
import {
  Team,
  WorkspaceStructure,
  WorkspaceType,
} from "../../schemas/workspace.schema";
import { makeWorkspaceStructureKey } from "../../lib/keys";
import { updateTeamMutator } from "../../models/workspace/mutators/update-team";

const rep = new Replicache({
  licenseKey: TEST_LICENSE_KEY,
  name: "test-user",
  pullURL: undefined,
  pushURL: undefined,
  mutators: workspaceMutators,
});

describe("Workspace teams' mutators", () => {
  beforeEach(async () => {
    const newWorkspace: WorkspaceType = {
      id: nanoid(ID_LENGTH),
      name: "Test Workspace",
      owner: UserId,
      environment: "local",
      createdAt: new Date().toISOString(),
    };

    await rep.mutate.initWorkspace(newWorkspace);
  });

  test("create a team", async () => {
    const team: Team = {
      createdBy: UserId,
      dirs: [],
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      members: [UserId],
      name: "Test Team",
      tags: [],
    };

    await rep.mutate.createTeam(team);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).toContainEqual(team);
  });

  test("create a team with invalid data", async () => {
    const team: Team = {
      createdBy: UserId,
      dirs: [],
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      members: [UserId],
      name: "",
      tags: [],
    };

    await expect(rep.mutate.createTeam(team)).rejects.toThrow(
      "Invalid team data"
    );
  });

  test("create a team with invalid owner", async () => {
    const team: Team = {
      createdBy: "-5oxKtIB8FXvYZL0ajjXp",
      dirs: [],
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      members: [UserId],
      name: "Test name",
      tags: [],
    };

    await expect(rep.mutate.createTeam(team)).rejects.toThrow(
      "Invalid team data"
    );
  });

  test("create a team with invalid members", async () => {
    const team: Team = {
      createdBy: UserId,
      dirs: [],
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      members: [],
      name: "Test1 name",
      tags: [],
    };

    await expect(rep.mutate.createTeam(team)).rejects.toThrow(
      "Invalid team data"
    );
  });

  test("update a team", () => {
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId],
      name: "Test name",
      tags: [],
    };

    const structure: Partial<WorkspaceStructure> = {
      teams: [team1],
    };

    const update: TeamUpdate = {
      target: "addMembers",
      value: ["-4oxKtIB8FXvYZL0AXjXp"],
      teamId: "8IccbrnIPFJqs9ic",
    };

    const newStructure = updateTeamMutator(
      update,
      structure as WorkspaceStructure
    );
    const team2: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId, "-4oxKtIB8FXvYZL0AXjXp"],
      name: "Test name",
      tags: [],
    };

    // await rep.mutate.createTeam(team1);

    // await rep.mutate.updateTeam(update);

    // const structure = await rep.query((tx: ReadTransaction) =>
    //   tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    // );

    expect(newStructure.teams).toHaveLength(1);
    expect(newStructure.teams).toContainEqual(team2);
  });

  test("update a team with invalid data", async () => {
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId],
      name: "Test name",
      tags: [],
    };

    const update: TeamUpdate = {
      target: "name",
      value: "",
      teamId: "8IccbrnIPFJqs9ic",
    };
    await rep.mutate.createTeam(team1);

    await expect(rep.mutate.updateTeam(update)).rejects.toThrow(
      "Invalid team data"
    );
  });

  // fixme important - Need to test the attempt to change a restricted field like createdBy
  test("update a team with invalid owner", async () => {
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId],
      name: "Test name",
      tags: [],
    };

    // Ignoring the type error on purpose
    const update: TeamUpdate = {
      // @ts-ignore
      target: "createdBy",
      value: "-4oxKtIB8FXvYZL0AXjXp",
      teamId: "8IccbrnIPFJqs9ic",
    };

    await rep.mutate.createTeam(team1);

    await expect(rep.mutate.updateTeam(update)).rejects.toThrow(
      "Invalid update target"
    );
  });

  // fixme - No need to test this now, what we can test is the attempt to remove the owner from the members
  test("update a team with invalid members", async () => {
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId, "-3oxKtIB8FXvYZL0AXjXp"],
      name: "Test name",
      tags: [],
    };

    const update: TeamUpdate = {
      target: "removeMembers",
      value: [UserId],
      teamId: "8IccbrnIPFJqs9ic",
    };

    await rep.mutate.createTeam(team1);

    await expect(rep.mutate.updateTeam(update)).rejects.toThrow(
      "Cannot remove the owner"
    );
  });

  test("delete a team", async () => {
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      members: [UserId],
      name: "Test name",
      tags: [],
    };

    await rep.mutate.createTeam(team1);

    await rep.mutate.deleteTeam(team1.id);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    // console.log(structure2?.teams);

    //?will fail
    // expect(structure?.teams).toContainEqual(team1);
    //?will pass
    expect(structure?.teams).not.toContainEqual(team1);
  });

  test("delete team with non existence id", async () => {
    const teamid = "QmuRKvadzm0EhC8i";
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      members: [UserId],
      name: "test",
      tags: [],
    };

    // *Will fail the test
    // const team2: Team = {
    //   createdBy: UserId,
    //   dirs: [],
    //   id: teamid,
    //   members: [UserId],
    //   name: "test",
    //   tags: [],
    // };

    await rep.mutate.createTeam(team1);
    await expect(rep.mutate.deleteTeam(teamid)).rejects.toThrow(
      "Team not found"
    );
  });

  // fixme - No need to test these cases
  test.skip("delete team with invalid owner", async () => {
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      members: [UserId],
      name: "test",
      tags: [],
    };
    const team2: Team = {
      createdBy: "-4oxKtIB8FXvYZL0AXjXp",
      dirs: [],
      id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
      members: [UserId],
      name: "test",
      tags: [],
    };

    //* Will fail the test
    // const team2: Team = {
    //   createdBy: UserId,
    //   dirs: [],
    //   id: nanoid(WORKSPACE_TEAM_ID_LENGTH),
    //   members: [UserId],
    //   name: "test",
    //   tags: [],
    // };

    await rep.mutate.createTeam(team1);

    // await rep.mutate.deleteTeam(team2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).toContainEqual(team1);
  });
  // todo: should validate if the members are not the same
  test.skip("delete team with invalid members", async () => {
    const teamid = "Y5Dop7ToRgfQBWJO";
    const teamid2 = "Y5Dop7ToRgfQBWJs";

    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: teamid,
      members: [UserId],
      name: "test8",
      tags: [],
    };
    const team2: Team = {
      createdBy: UserId,
      dirs: [],
      id: teamid2,
      members: [],
      name: "test8",
      tags: [],
    };

    //* Will fail the test
    // const team2: Team = {
    //   createdBy: UserId,
    //   dirs: [],
    //   id: teamid,
    //   members: [UserId],
    //   name: "test8",
    //   tags: [],
    // };

    await rep.mutate.createTeam(team1);

    // await rep.mutate.deleteTeam(team2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).toContainEqual(team1);
  });
});
