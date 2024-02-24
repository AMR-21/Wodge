import { WorkspaceType } from "@repo/data/schemas";
import { Separator, useWorkspaces } from "@repo/ui";
import { WorkspaceItem } from "./workspace-item";
import { useUserWorkspaces } from "@repo/ui/hooks/use-user-workspaces";

export function WorkspacesList() {
  const workspaces = useWorkspaces();
  const { isPending, workspaces: userWorkspaces } = useUserWorkspaces();

  if (!isPending && (!userWorkspaces || userWorkspaces.length === 0))
    return (
      <p className="p-5 text-center text-muted-foreground">
        Join or create workspace to start using Wodge
      </p>
    );

  if (!workspaces)
    return (
      <div className="w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <WorkspaceItem.Skeleton key={i} />
        ))}
      </div>
    );

  return (
    <>
      {workspaces &&
        Object.values(workspaces).map((workspace: WorkspaceType, i) => {
          return (
            <div className="w-full" key={workspace.id}>
              {/* Bug in id */}
              <WorkspaceItem workspace={workspace} />
              {i !== Object.values(workspaces).length - 1 && <Separator />}
            </div>
          );
        })}
    </>
  );
}
