import { describe, expect, test } from "vitest";
import { createTestRole, createTestStructure } from "../utils";
import { UserId } from "../tests";
import { WORKSPACE_GROUP_ID_LENGTH } from "../..";

import { nanoid } from "nanoid";
import { createRoleMutation } from "../../models/workspace/mutators/create-group";
import { updateRoleInfoMutation } from "../../models/workspace/mutators/group-info";
import {
  addRoleMembersMutation,
  removeRoleMembersMutation,
} from "../../models/workspace/mutators/group-members";

import { deleteRoleMutation } from "../../models/workspace/mutators/delete-group";

describe("Workspace teams' unit mutations", () => {
  test("create a role", async () => {
    const structure = createTestStructure();

    // TEST: Create a valid team
    const role1 = createTestRole();

    expect(
      createRoleMutation({ role: role1, structure, currentUserId: UserId })
        .roles
    ).toContainEqual(role1);

    // TEST: Create a team with invalid data
    const role2 = createTestRole({ name: "" });

    expect(() =>
      createRoleMutation({ role: role2, structure, currentUserId: UserId })
    ).toThrowError(/^Invalid role data$/);

    const role3 = createTestRole({ createdBy: "" });

    expect(() =>
      createRoleMutation({ role: role3, structure, currentUserId: UserId })
    ).toThrowError(/^Invalid role data$/);

    // Test: Create a team with invalid owner
    const role4 = createTestRole({ createdBy: "-4oxKtIB8FXvYZL0AXjXp" });

    expect(() =>
      createRoleMutation({ role: role4, structure, currentUserId: UserId })
    ).toThrowError(/^Unauthorized role creation$/);

    // Test: Create a team that already exists
    const roleId = nanoid(WORKSPACE_GROUP_ID_LENGTH);
    const role5 = createTestRole({ id: roleId });

    const newStructure = createRoleMutation({
      role: role5,
      structure,
      currentUserId: UserId,
    });

    expect(() =>
      createRoleMutation({
        role: role5,
        structure: newStructure,
        currentUserId: UserId,
      })
    ).toThrowError(/^Role already exists$/);

    // Test: Team creation sanitization
    const role6 = createTestRole({
      members: ["-4oxKtIB8FXvYZL0AXjXp"],
    });

    expect(
      createRoleMutation({ role: role6, structure, currentUserId: UserId })
        .roles
    ).toContainEqual({
      ...role6,
      members: [],
      permissions: [],
    });
  });

  test("update a role", () => {
    const roleId = nanoid(WORKSPACE_GROUP_ID_LENGTH);
    const role = createTestRole({ id: roleId });
    const structure = createRoleMutation({
      role,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: Basic role update
    const s1 = updateRoleInfoMutation({
      structure,
      roleId,
      update: { name: "New Name", color: "#121313" },
    });

    expect(s1).toEqual({
      ...structure,
      roles: [{ ...role, name: "New Name", color: "#121313" }],
    });

    // update a team with invalid data
    expect(() =>
      updateRoleInfoMutation({
        structure,
        roleId,
        //@ts-ignore
        update: { name: "" },
      })
    ).toThrowError(/^Invalid role update data$/);
  });

  test("update role members", () => {
    const roleId = nanoid(WORKSPACE_GROUP_ID_LENGTH);
    const role = createTestRole({ id: roleId });
    const structure = createRoleMutation({
      role,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    const curMembers = [
      "-4oxKtIB8FXvYZL0AXjXp",
      "-2oxKtIB8FXvYZL0AXjXp",
      "-3oxKtIB8FXvYZL0AXjXp",
    ];

    // Test: update role members
    expect(
      addRoleMembersMutation({
        structure,
        roleId,
        update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
        curMembers,
      })
    ).toEqual({
      ...structure,
      roles: [{ ...role, members: ["-4oxKtIB8FXvYZL0AXjXp"] }],
    });

    const s2 = addRoleMembersMutation({
      structure,
      roleId,
      update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
      curMembers,
    });

    expect(
      removeRoleMembersMutation({
        structure: s2,
        roleId,
        update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
      })
    ).toEqual({
      ...structure,
      roles: [{ ...role, members: [] }],
    });

    // Test: update role members with invalid data
    expect(() =>
      addRoleMembersMutation({
        structure,
        roleId,
        //@ts-ignore
        update: { members: [""], createdBy: "" },
        curMembers,
      })
    ).toThrowError(/^Invalid role update data$/);

    // non existence role
    expect(() =>
      addRoleMembersMutation({
        structure,
        roleId: "non existence id",
        update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
        curMembers,
      })
    ).toThrowError(/^Role does not exist$/);

    expect(() =>
      addRoleMembersMutation({
        structure,
        roleId,
        update: { members: ["-9oxKtIB8FXvYZL0AXjXp"] },
        curMembers,
      })
    ).toThrowError(/^Invalid members$/);
  });

  test("delete a role", () => {
    const roleId = nanoid(WORKSPACE_GROUP_ID_LENGTH);
    const role = createTestRole({ id: roleId });
    const structure = createRoleMutation({
      role,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: delete a role
    expect(
      deleteRoleMutation({
        structure,
        roleId,
      })
    ).toEqual({
      ...structure,
      roles: [],
    });

    // Test: delete a role with invalid data
    expect(() =>
      deleteRoleMutation({
        structure,
        roleId: "non existence id",
      })
    ).toThrowError(/^Role not found$/);
  });
});
