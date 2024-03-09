import { beforeAll, describe, expect, test } from "vitest";
import { workspaceMutators } from "../models/workspace/workspace-mutators";
import { ReadTransaction, Replicache, TEST_LICENSE_KEY } from "replicache";

import { User } from "../models/user/user";
import { Team, Role, WorkspaceStructure } from "../schemas/workspace.schema";
import { UserId } from "../tests";
import { nanoid } from "nanoid";
import { ID_LENGTH, WORKSPACE_TEAM_ID_LENGTH } from "../schemas/config";
import { makeWorkspaceStructureKey } from "../lib/keys";
import { a } from "vitest/dist/suite-UrZdHRff.js";
import exp from "constants";

const rep = new Replicache({
  licenseKey: TEST_LICENSE_KEY,
  name: "test-user",
  pullURL: undefined,
  pushURL: undefined,
  mutators: workspaceMutators,
});

describe("Team mutators", () => {
  beforeAll(async () => {
    await rep.mutate.initWorkspace({
      id: nanoid(ID_LENGTH),
      name: "Test Workspace",
      owner: UserId,

      environment: "local",
      createdAt: new Date().toISOString(),
    });
  });

  // *Team tests
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

    await rep.mutate.createTeam(team);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).not.toContain(team);
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

    await rep.mutate.createTeam(team);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).not.toContain(team);
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

    await rep.mutate.createTeam(team);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).not.toContain(team);
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

    await rep.mutate.deleteTeam(team1);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    // console.log(structure2?.teams);

    //?will fail
    // expect(structure?.teams).toContainEqual(team1);
    //?will pass
    expect(structure?.teams).not.toContainEqual(team1);
  });

  test("delete team with invalid data", async () => {
    const teamid = "QmuRKvadzm0EhC8i";
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: teamid,
      members: [UserId],
      name: "test",
      tags: [],
    };
    const team2: Team = {
      createdBy: UserId,
      dirs: [],
      id: teamid,
      members: [UserId],
      name: "",
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

    await rep.mutate.deleteTeam(team2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );
    expect(structure?.teams).toContainEqual(team1);
  });

  test("delete team with invalid owner", async () => {
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

    await rep.mutate.deleteTeam(team2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).toContainEqual(team1);
  });
  // todo: should validate if the members are not the same
  test("delete team with invalid members", async () => {
    const teamid = "Y5Dop7ToRgfQBWJO";
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
      id: teamid,
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

    await rep.mutate.deleteTeam(team2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).toContainEqual(team1);
  });

  test("update a team", async () => {
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId],
      name: "Test name",
      tags: [],
    };
    const team2: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId, "-4oxKtIB8FXvYZL0AXjXp"],
      name: "Test name",
      tags: [],
    };

    await rep.mutate.createTeam(team1);

    await rep.mutate.updateTeam(team2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).toContainEqual(team2);
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
    const team2: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId, "-4oxKtIB8FXvYZL0AXjXp"],
      name: "",
      tags: [],
    };

    await rep.mutate.createTeam(team1);

    await rep.mutate.updateTeam(team2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).not.toContainEqual(team2);
  });

  test("update a team with invalid owner", async () => {
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId],
      name: "Test name",
      tags: [],
    };
    const team2: Team = {
      createdBy: "-4oxKtIB8FXvYZL0AXjXp",
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId, "-4oxKtIB8FXvYZL0AXjXp"],
      name: "",
      tags: [],
    };

    await rep.mutate.createTeam(team1);

    await rep.mutate.updateTeam(team2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).not.toContainEqual(team2);
  });

  test("update a team with invalid members", async () => {
    const team1: Team = {
      createdBy: UserId,
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: [UserId],
      name: "Test name",
      tags: [],
    };
    const team2: Team = {
      createdBy: "-4oxKtIB8FXvYZL0AXjXp",
      dirs: [],
      id: "8IccbrnIPFJqs9ic",
      members: ["-4oxKtIB8FXvYZL0AXjXp", "-3oxKtIB8FXvYZL0AXjXp"],
      name: "",
      tags: [],
    };

    await rep.mutate.createTeam(team1);

    await rep.mutate.updateTeam(team2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.teams).not.toContainEqual(team2);
  });

  test("create Role", async () => {
    const role1: Role = {
      createdBy: UserId,
      id: "8IccbrnIPFJqs9ic",
      members: [UserId],
      name: "Test name",
      permissions: ["read"],
      linkedTo: [],
    };

    await rep.mutate.createRole(role1);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.roles).toContainEqual(role1);
  });

  test("create Role with invalid data", async () => {
    const role1: Role = {
      createdBy: UserId,
      id: "8IccbrnIPFJqs9ic",
      members: [UserId],
      name: "",
      permissions: ["read"],
      linkedTo: [],
    };

    await rep.mutate.createRole(role1);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.roles).not.toContainEqual(role1);
  });

  test("create Role with invalid owner", async () => {
    const role1: Role = {
      createdBy: "-4oxKtIB8FXvYZL0AXjXp",
      id: "8IccbrnIPFJqs9ic",
      members: [UserId],
      name: "Test name",
      permissions: ["read"],
      linkedTo: [],
    };

    await rep.mutate.createRole(role1);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.roles).not.toContainEqual(role1);
  });

  test("create Role with invalid members", async () => {
    const role1: Role = {
      createdBy: UserId,
      id: "8IccbrnIPFJqs9ic",
      members: [],
      name: "Test name",
      permissions: ["read"],
      linkedTo: [],
    };

    await rep.mutate.createRole(role1);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.roles).not.toContainEqual(role1);
  });

  // test("update Role", async () => {
  //   const role1: Role = {
  //     createdBy: UserId,
  //     id: "8IccbrnIPFJqs9ic",
  //     members: [UserId],
  //     name: "Test name",
  //     permissions: ["read"],
  //     linkedTo: [],
  //   };

  //   await rep.mutate.createRole(role1);

  //   const structure = await rep.query((tx: ReadTransaction) =>
  //     tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
  //   );

  //   expect(structure?.roles).toContainEqual(role1);
  // });
});
