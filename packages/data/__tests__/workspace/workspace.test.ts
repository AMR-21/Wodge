import { beforeAll, describe, expect, test } from "vitest";
import { workspaceMutators } from "../../models/workspace/workspace-mutators";
import { ReadTransaction, Replicache, TEST_LICENSE_KEY } from "replicache";

import { User } from "../../models/user/user";
import {
  Team,
  Role,
  WorkspaceStructure,
  WorkspaceType,
} from "../../schemas/workspace.schema";
import { UserId } from "../../tests";
import { nanoid } from "nanoid";
import { ID_LENGTH, WORKSPACE_TEAM_ID_LENGTH } from "../../schemas/config";
import { makeWorkspaceKey, makeWorkspaceStructureKey } from "../../lib/keys";
import { beforeEach } from "node:test";

const rep = new Replicache({
  licenseKey: TEST_LICENSE_KEY,
  name: "test-user",
  pullURL: undefined,
  pushURL: undefined,
  mutators: workspaceMutators,
});

test.only("Workspace local initialization", async () => {
  const newWorkspace: WorkspaceType = {
    id: nanoid(ID_LENGTH),
    name: "Test Workspace",
    owner: UserId,
    environment: "local",
    createdAt: new Date().toISOString(),
  };

  await rep.mutate.initWorkspace(newWorkspace);

  const workspace = await rep.query((tx: ReadTransaction) =>
    tx.get<WorkspaceType>(makeWorkspaceKey())
  );

  expect(workspace).toEqual(newWorkspace);
});

describe("Team mutators", () => {
  beforeEach(async () => {
    await rep.mutate.initWorkspace({
      id: nanoid(ID_LENGTH),
      name: "Test Workspace",
      owner: UserId,

      environment: "local",
      createdAt: new Date().toISOString(),
    });
  });

  // *Team tests

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

  test("update Role", async () => {
    const role1: Role = {
      createdBy: UserId,
      id: "8IccbrnIPFJqs9ib",
      members: [UserId],
      name: "Test name",
      permissions: ["read"],
      linkedTo: [],
    };
    const role2: Role = {
      createdBy: UserId,
      id: "8IccbrnIPFJqs9ib",
      members: [UserId, "-4oxKtIB8FXvYZL0AXjXp"],
      name: "Test name",
      permissions: ["read"],
      linkedTo: [],
    };

    await rep.mutate.createRole(role1);

    await rep.mutate.updateRole(role2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    expect(structure?.roles).toContainEqual(role2);
  });

  test("update Role with invalid data", async () => {
    const role1: Role = {
      createdBy: UserId,
      id: "8IccbrnIPFJqs9ib",
      members: [UserId],
      name: "Test name",
      permissions: ["read"],
      linkedTo: [],
    };
    const role2: Role = {
      createdBy: UserId,
      id: "8IccbrnIPFJqs9ib",
      members: [UserId, "-4oxKtIB8FXvYZL0AXjXp"],
      name: "",
      permissions: ["read"],
      linkedTo: [],
    };

    await rep.mutate.createRole(role1);

    const structure1 = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    console.log(structure1?.roles);

    await rep.mutate.updateRole(role2);

    const structure = await rep.query((tx: ReadTransaction) =>
      tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
    );

    console.log(structure?.roles);

    expect(structure?.roles).toContainEqual(role2);
  });
});
