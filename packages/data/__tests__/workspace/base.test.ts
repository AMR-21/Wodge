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

test("Workspace local initialization", async () => {
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
