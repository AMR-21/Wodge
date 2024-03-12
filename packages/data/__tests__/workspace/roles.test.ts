// import { nanoid } from "nanoid";
// import { ReadTransaction, Replicache, TEST_LICENSE_KEY } from "replicache";
// import { beforeEach, describe, expect, test } from "vitest";
// import {
//   RoleUpdate,
//   workspaceMutators,
// } from "../../models/workspace/workspace-mutators";
// import { ID_LENGTH } from "../../schemas/config";
// import { UserId } from "../../tests";
// import { Role, WorkspaceStructure } from "../../schemas/workspace.schema";
// import { makeWorkspaceStructureKey } from "../../lib/keys";

// const rep = new Replicache({
//   licenseKey: TEST_LICENSE_KEY,
//   name: "test-user",
//   pullURL: undefined,
//   pushURL: undefined,
//   mutators: workspaceMutators,
// });

// describe("Workspace Roles' mutators", () => {
//   beforeEach(async () => {
//     await rep.mutate.initWorkspace({
//       id: nanoid(ID_LENGTH),
//       name: "Test Workspace",
//       owner: UserId,

//       environment: "local",
//       createdAt: new Date().toISOString(),
//     });
//   });

//   test("create Role", async () => {
//     const role1: Role = {
//       createdBy: UserId,
//       id: "8IccbrnIPFJqs9ic",
//       members: [UserId],
//       name: "Test name",
//       permissions: ["read"],
//       linkedTeams: [],
//     };

//     await rep.mutate.createRole(role1);

//     const structure = await rep.query((tx: ReadTransaction) =>
//       tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
//     );

//     expect(structure?.roles).toContainEqual(role1);
//   });

//   test("create Role with invalid data", async () => {
//     const role1: Role = {
//       createdBy: UserId,
//       id: "8IccbrnIPFJqs9ic",
//       members: [UserId],
//       name: "",
//       permissions: ["read"],
//       linkedTeams: [],
//     };

//     await expect(rep.mutate.createRole(role1)).rejects.toThrow(
//       "Invalid role data"
//     );
//   });

//   // fixme - no need for this test - the creator has not to be a member
//   // fixme - already check not covered in the code so it should pass the test below
//   test.skip("create Role with invalid owner", async () => {
//     const role1: Role = {
//       createdBy: "-4oxKtIB8FXvYZL0AXjXp",
//       id: "8IccbrnIPFJqs9ic",
//       members: [UserId],
//       name: "Test name",
//       permissions: ["read"],
//       linkedTeams: [],
//     };

//     await rep.mutate.createRole(role1);

//     const structure = await rep.query((tx: ReadTransaction) =>
//       tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
//     );

//     // fixme fails because the role is created normally
//     expect(structure?.roles).not.toContainEqual(role1);
//   });

//   test("create Role with invalid members", async () => {
//     const role1: Role = {
//       createdBy: UserId,
//       id: "8IccbrnIPFJqs9ic",
//       // fixme - to have invalid member pass invalid member id
//       members: ["failure id"],
//       name: "Test name",
//       permissions: ["read"],
//       linkedTeams: [],
//     };

//     await expect(rep.mutate.createRole(role1)).rejects.toThrow(
//       "Invalid role data"
//     );
//   });

//   test("update Role", async () => {
//     const role1: Role = {
//       createdBy: UserId,
//       id: "8IccbrnIPFJqs9ib",
//       members: [UserId],
//       name: "Test name",
//       permissions: ["read"],
//       linkedTeams: [],
//     };

//     const update: RoleUpdate = {
//       roleId: "8IccbrnIPFJqs9ib",
//       target: "addMembers",
//       value: ["-4oxKtIB8FXvYZL0AXjXp"],
//     };

//     const role2: Role = {
//       createdBy: UserId,
//       id: "8IccbrnIPFJqs9ib",
//       members: [UserId, "-4oxKtIB8FXvYZL0AXjXp"],
//       name: "Test name",
//       permissions: ["read"],
//       linkedTeams: [],
//     };

//     await rep.mutate.createRole(role1);

//     await rep.mutate.updateRole(update);

//     const structure = await rep.query((tx: ReadTransaction) =>
//       tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
//     );

//     expect(structure?.roles).toContainEqual(role2);
//   });

//   test("update role with duplicate permissions", async () => {
//     const role1: Role = {
//       createdBy: UserId,
//       id: "8IccbrnIPFJqs9ib",
//       members: [UserId],
//       name: "Test name",
//       permissions: ["read"],
//       linkedTeams: [],
//     };

//     const update: RoleUpdate = {
//       roleId: "8IccbrnIPFJqs9ib",
//       target: "addPermissions",
//       value: ["read", "write"],
//     };

//     const role2: Role = {
//       createdBy: UserId,
//       id: "8IccbrnIPFJqs9ib",
//       members: [UserId],
//       name: "Test name",
//       permissions: ["read", "write"],
//       linkedTeams: [],
//     };

//     await rep.mutate.createRole(role1);

//     await rep.mutate.updateRole(update);

//     const structure = await rep.query((tx: ReadTransaction) =>
//       tx.get<WorkspaceStructure>(makeWorkspaceStructureKey())
//     );

//     expect(structure?.roles).toContainEqual(role2);
//   });

//   test("update Role with invalid data", async () => {
//     const role1: Role = {
//       createdBy: UserId,
//       id: "8IccbrnIPFJqs9ib",
//       members: [UserId],
//       name: "Test name",
//       permissions: ["read"],
//       linkedTeams: [],
//     };

//     const update: RoleUpdate = {
//       roleId: "8IccbrnIPFJqs9ib",
//       target: "name",
//       value: "",
//     };

//     await rep.mutate.createRole(role1);

//     await expect(rep.mutate.updateRole(update)).rejects.toThrow(
//       "Invalid role data"
//     );
//   });
// });
