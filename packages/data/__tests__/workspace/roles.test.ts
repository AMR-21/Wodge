import { describe, expect, test } from "vitest";
import { createTestRole, createTestStructure } from "../utils";
import { createRole } from "../../models/workspace/mutators/create-role";
import { UserId } from "../../tests";
import { WORKSPACE_ROLE_ID_LENGTH } from "../..";

import { nanoid } from "nanoid";
import { updateRoleInfo } from "../../models/workspace/mutators/role-info";
import {
  addRoleMembers,
  removeRoleMembers,
} from "../../models/workspace/mutators/role-members";
import { addRolePermissions } from "../../models/workspace/mutators/role-permissions";

describe("Workspace teams' unit mutations", () => {
  test("create a role", async () => {
    const structure = createTestStructure();

    // TEST: Create a valid team
    const role1 = createTestRole();

    expect(
      createRole({ role: role1, structure, currentUserId: UserId }).roles
    ).toContainEqual(role1);

    // TEST: Create a team with invalid data
    const role2 = createTestRole({ name: "" });

    expect(() =>
      createRole({ role: role2, structure, currentUserId: UserId })
    ).toThrowError(/^Invalid role data$/);

    const role3 = createTestRole({ createdBy: "" });

    expect(() =>
      createRole({ role: role3, structure, currentUserId: UserId })
    ).toThrowError(/^Invalid role data$/);

    // Test: Create a team with invalid owner
    const role4 = createTestRole({ createdBy: "-4oxKtIB8FXvYZL0AXjXp" });

    expect(() =>
      createRole({ role: role4, structure, currentUserId: UserId })
    ).toThrowError(/^Unauthorized role creation$/);

    // Test: Create a team that already exists
    const roleId = nanoid(WORKSPACE_ROLE_ID_LENGTH);
    const role5 = createTestRole({ id: roleId });

    const newStructure = createRole({
      role: role5,
      structure,
      currentUserId: UserId,
    });

    expect(() =>
      createRole({
        role: role5,
        structure: newStructure,
        currentUserId: UserId,
      })
    ).toThrowError(/^Role already exists$/);

    // Test: Team creation sanitization
    const role6 = createTestRole({
      members: ["-4oxKtIB8FXvYZL0AXjXp"],

      permissions: ["admin"],
    });

    expect(
      createRole({ role: role6, structure, currentUserId: UserId }).roles
    ).toContainEqual({
      ...role6,
      members: [],
      permissions: [],
    });
  });

  test("update a role", () => {
    const roleId = nanoid(WORKSPACE_ROLE_ID_LENGTH);
    const role = createTestRole({ id: roleId });
    const structure = createRole({
      role,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: Basic role update
    const s1 = updateRoleInfo({
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
      updateRoleInfo({
        structure,
        roleId,
        //@ts-ignore
        update: { name: "" },
      })
    ).toThrowError(/^Invalid role update data$/);
  });

  test("update role members", () => {
    const roleId = nanoid(WORKSPACE_ROLE_ID_LENGTH);
    const role = createTestRole({ id: roleId });
    const structure = createRole({
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
      addRoleMembers({
        structure,
        roleId,
        update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
        curMembers,
      })
    ).toEqual({
      ...structure,
      roles: [{ ...role, members: ["-4oxKtIB8FXvYZL0AXjXp"] }],
    });

    const s2 = addRoleMembers({
      structure,
      roleId,
      update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
      curMembers,
    });

    expect(
      removeRoleMembers({
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
      addRoleMembers({
        structure,
        roleId,
        //@ts-ignore
        update: { members: [""], createdBy: "" },
        curMembers,
      })
    ).toThrowError(/^Invalid role update data$/);

    // non existence role
    expect(() =>
      addRoleMembers({
        structure,
        roleId: "non existence id",
        update: { members: ["-4oxKtIB8FXvYZL0AXjXp"] },
        curMembers,
      })
    ).toThrowError(/^Role does not exist$/);

    expect(() =>
      addRoleMembers({
        structure,
        roleId,
        update: { members: ["-9oxKtIB8FXvYZL0AXjXp"] },
        curMembers,
      })
    ).toThrowError(/^Invalid members$/);
  });

  test("update role permissions", () => {
    const roleId = nanoid(WORKSPACE_ROLE_ID_LENGTH);
    const role = createTestRole({ id: roleId });
    const structure = createRole({
      role,
      structure: createTestStructure(),
      currentUserId: UserId,
    });

    // Test: update role permissions
    expect(
      addRolePermissions({
        structure,
        roleId,
        update: {
          permissions: ["admin"],
        },
      })
    ).toEqual({
      ...structure,
      roles: [
        {
          ...role,
          permissions: ["admin"],
        },
      ],
    });

    // Test: update team permissions with invalid data
    expect(() =>
      addRolePermissions({
        structure,
        roleId: nanoid(WORKSPACE_ROLE_ID_LENGTH),
        //@ts-ignore
        update: { permissions: ["write"] },
      })
    ).toThrowError(/^Role does not exist$/);

    expect(() =>
      addRolePermissions({
        structure,
        roleId,
        //@ts-ignore
        update: { permissions: ["manager"] },
      })
    ).toThrowError(/^Invalid role update data$/);
  });
});
