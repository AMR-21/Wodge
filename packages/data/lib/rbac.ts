import { Role, Team } from "../schemas/workspace.schema";

export function grant(roles: Role[], requiredPermissions: Role["permissions"]) {
  return roles.some((role) => {
    // Admin permission - always has access
    if (
      requiredPermissions.includes("admin") &&
      role.permissions.includes("admin")
    )
      return true;

    return requiredPermissions.every((permission) =>
      role.permissions.includes(permission)
    );
  });
}

export function teamPass(teams: Team[], targetTeam: string) {
  return teams.some((team) => {
    if (team.id === targetTeam) {
      return true;
    }
  });
}
