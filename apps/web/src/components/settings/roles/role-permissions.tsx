import { Role } from "@repo/data";
import { Checkbox, Input, Switch } from "@repo/ui";
import { number } from "zod";

const defaultPermissions: {
  permission: Role["permissions"][number];
  description: string;
}[] = [
  {
    permission: "read",
    description:
      "Allow members to view channels within the teams they are a members of.",
  },
  {
    permission: "write",
    description: "Allow to member to collaborate and communicate in channels.",
  },
  {
    permission: "admin",
    description: "Role has full control over the workspace.",
  },
];

export function RolePermissions({
  permissions,
  changePermissions,
}: {
  permissions: string[];
  changePermissions: (permission: string, add: boolean) => void;
}) {
  return (
    <div className="flex flex-col divide-y-[1px] divide-border/50">
      {defaultPermissions.map((permission) => {
        const isChecked = permissions.includes(permission.permission);
        return (
          <div key={permission.permission} className="flex flex-col gap-2 py-5">
            <div className="flex grow items-center justify-between">
              <p className="capitalize">{permission.permission}</p>
              <Switch
                defaultChecked={isChecked}
                onCheckedChange={(e) =>
                  changePermissions(permission.permission, e)
                }
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {permission.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
